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
const user = require('../models/user');

route.get('/', (req, res) => {
    // console.log(req.user);
    Category.find({}, (err, foundCategories) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {categories: foundCategories});
        }
    })
});

route.get('/category/:parent', (req, res) => {
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
                res.render('categoryShow', {category: foundCategory[0], trainers: trainers});
            }
        })
    })
});

route.post('/newSession', (req, res) => {
    // console.log(req.user);
    User.findById(req.user._id, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            Trainer.findById(req.body.trainerId, (err, trainer) => {
                if(err) {
                    console.log(trainer);
                } else {
                    if(!(user.trainers.indexOf(trainer) in user.trainers)) {
                        user.trainers.push(trainer);
                        user.save();
                        // console.log(user);
                        res.redirect('/user/userDashboard/' + user._id);
                    }
                }
            });
        }
    });
    
    // req.user.save();
});

route.get('/userDashboard/:id', (req, res) => {
    User.findById(req.params.id).populate("trainers").exec(function(err, user) {
        if(err) {
            console.log(err);
        } else {
            // console.log(user);
            res.render('userDashboard', {user: user});
        }
    })
});

route.put('/updateuser', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            user.bookedSlot = req.query.data;
            user.save();
        }
    })
});

route.get('/zoomDashboard',(req, res)=>{
    res.render('userZoomDashboard.ejs');
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


route.post('/signature/:trainerId',(req,res)=>{

    var options = {
        method: 'GET',
        url: 'http://127.0.0.1:3500/trainer/passMeetingDetails/?id='+req.params.trainerId,
        headers: {
            'content-type': 'application/json'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        body = JSON.parse(body);
        console.log(body);
        
        function generateSignature(apiKey,apiSecret, meetingNumber, role) {
            
            // Prevent time sync issue between client signature generation and zoom 
            const timestamp = new Date().getTime() - 30000
            const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
            const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
            const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
            
            return signature
        }
        
        // // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
          signature = generateSignature(config.APIKey, config.APISecret,body.meetConfig.meetingNumber,0);
        
          body.meetConfig.signature = signature;
          body.meetConfig.username = req.user.username;
        
          res.json({body});
    });

});

module.exports = route;