var express = require('express');
var route = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/credentials');
const rp = require('request-promise');
var http = require("https");
const request = require('request');

var User = require('../models/user');
var Trainer = require('../models/trainer');
var Category = require('../models/category');

var middleware = require("../middleware");

route.get('/', (req, res) => {
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Category.find({title: regex}, (err, foundCategories) => {
            if(err) {
                console.log(err);
            } else {
                var noMatch = "";
                if(foundCategories.length < 1) {
                    noMatch = "No categories found, please try again!";
                }
                res.render('index1', {categories: foundCategories, noMatch: noMatch});
            }
        })
    } else {
    Category.find({}, (err, foundCategories) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {categories: foundCategories});
        }
    })
}
    // res.render('index');
});


route.get('/isCreated/:id',(req,res)=>{
    Trainer.findById(req.params.id,(err,trainer)=>{
        if(err){
            console.log(err);
        }else{
            var isCreated = trainer.isCreated;
            res.json({isCreated});
        }
    });
});

route.get('/bookedSlots/:id',(req, res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err);
        }else{
            res.json(user.bookedSlot);
        }
    });
    });

route.get('/category/:parent', (req, res) => {
    var parent = req.params.parent;
Category.find({parent:req.params.parent}, (err, foundCategory) => { 
        var titles = [];
        for(var i=0;i<foundCategory.length;i++){
            titles.push(foundCategory[i].title);
        }

        Trainer.find({}, (err, foundTrainer) => {
            if(err) {
                console.log(err)
            } else {
                var trainers = [];
                foundTrainer.forEach(function(trainer) {
                    for (var i=0;i<trainer.subCategories.length;i++){
    
                        if(titles.indexOf(trainer.subCategories[i]) in titles===true){
                            if (trainers.indexOf(trainer) in trainers==true){
                                continue;
                            }else{
                                trainers.push(trainer);
                            }
                        }
                    }
                });
                res.render('categoryShow', {category: foundCategory[0], trainers: trainers, parent: parent});
            }
        })
    })
});

route.post('/newSession', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            Trainer.findById(req.body.trainerId, (err, trainer) => {
                if(err) {
                    console.log(err);
                } else {
                    if(!(user.trainers.some(el => el.id == trainer._id))) {
                        var info = {
                            id: trainer._id,
                            category: req.body.category,
                            name: req.body.username,
                            type: req.body.type,
                            numOfSessions: req.body.numOfSessions,
                        }
                        user.trainers.push(info);
                        
                        const obj = new Object();
                        obj[trainer.username] = new Array();

                        user.bookedSlot.push(obj);
                        user.markModified('trainers');
                        user.markModified('bookedSlot');
                        user.save();
                        res.redirect('/user/userDashboard/' + user._id);
                    } else {
                        res.redirect('/user/userDashboard/' + user._id);
                    }
                }
            });
        }
    });
});

route.get('/userDashboard/:id', (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('userDashboard', {user: user});
        }
    })
});

route.put('/updateuser/', (req, res) => {
    trainerID = Object.keys(req.body.userCount)[0];
    Trainer.findById(trainerID,(err,trainer)=>{
        if(err){
            console.log(err);
        }
        else{
            var trainerSlots = trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]];
            for(var i=0;i<trainerSlots.length;i++){
                var timeStr=trainerSlots[i].slice(0,11);
                timeStr = timeStr.split(' ')[0]+'-'+timeStr.split(' ')[2];
                
                if(req.body.userCount[trainerID][Object.keys(req.body.userCount[trainerID])[0]] == timeStr){
                    var ref = trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]][i];
                    var output = ref.substring(0,ref.length-1) + (parseInt(ref.slice('-1'))+1);
                    trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]][i] = output;
                }
            }
            trainer.markModified('calendar');
            trainer.save();
        }
    });
    User.findByIdAndUpdate(req.user._id,
        {
            bookedSlot: req.body.booked
        },
        (err, user) => {
        if(err) {
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    })
});

// route.get('/:categoryType', (req, res) => {
//     Trainer.find({categoryType: req.query.categoryType}, (err, foundTrainer) => {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('');
//         }
//     });
// });

route.get('/zoomDashboard/:id',(req, res)=>{
    res.render('userZoomDashboard.ejs',{trainer:req.params.id});
});

route.get('/getTimeTable/:id', (req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        res.json(foundTrainer.calendar);
    })
});

var meetConfig = {
    password:null,
    signature:null,
    meetingNumber:null,
    username:null
};


route.post('/signature',(req,res)=>{

    var options = {
        method: 'GET',
        url: 'http://127.0.0.1:3500/trainer/passMeetingDetails/'+req.body.trainerId,
        // url: 'https://shapeyou-demo.herokuapp.com/trainer/passMeetingDetails/'+req.body.trainerId,
        headers: {
            'content-type': 'application/json'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        body = JSON.parse(body);
        
        function generateSignature(apiKey,apiSecret, meetingNumber, role) {
            
            // Prevent time sync issue between client signature generation and zoom 
            const timestamp = new Date().getTime() - 30000
            const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
            const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
            const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
            
            return signature
        }
        
        // // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
          signature = generateSignature(config.APIKey, config.APISecret,body.meetingNumber,0);
        
          body.signature = signature;
          body.username = req.user.username;
        
          res.json({body});
    });

});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = route;