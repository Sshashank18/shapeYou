const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');
const Category = require('../models/category');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const config = require('../config/credentials');
const rp = require('request-promise');
var http = require("https");

const request = require('request');
const e = require('express');


const route = express.Router();

route.get('/',(req,res)=>{
    Trainer.findById(req.user._id).populate('users').exec( (err,trainer)=>{
        res.render('trainerDashboard', {trainer:trainer});
    });
});
 
route.get('/details',(req,res)=>{
    res.render('details');
});

route.put('/submitDetails',(req,res)=>{
    Trainer.findByIdAndUpdate(req.user._id,
        {
            dob:req.body.dob,
            profilePic:req.body.image,
            about:req.body.about,
            subCategories: req.body.subcategories
        }
    ,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});


route.get('/getTimeTable/:id',(req,res)=>{
    Trainer.findById(req.params.id,(err,result)=>{
        res.json(result.calendar);
    });
})

route.put('/setTimeTable/:id',(req,res)=>{
    Trainer.findByIdAndUpdate(req.params.id,
        {
            calendar:req.body
        }
    ,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.sendStatus(200);
    });
});

route.get('/personalSlots', (req, res) => {
    res.render('trainerPersonal');
});

route.put('/personalSlots', (req, res) => {
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    const arr4 = [];
    const arr5 = [];
    const arr6 = [];
    if(req.body.Monday) arr1.push(req.body.Monday);
    if(req.body.Tuesday) arr2.push(req.body.Tuesday);
    if(req.body.Wednesday) arr3.push(req.body.Wednesday);
    if(req.body.Thursday) arr4.push(req.body.Thursday);
    if(req.body.Friday) arr5.push(req.body.Friday);
    if(req.body.Saturday) arr6.push(req.body.Saturday);
    var arr1f = Array.prototype.concat.apply([], arr1);
    var arr2f = Array.prototype.concat.apply([], arr2);
    var arr3f = Array.prototype.concat.apply([], arr3);
    var arr4f = Array.prototype.concat.apply([], arr4);
    var arr5f = Array.prototype.concat.apply([], arr5);
    var arr6f = Array.prototype.concat.apply([], arr6);
    const obj = 
    {
        Monday: arr1f,
        Tuesday: arr2f,
        Wednesday: arr3f,
        Thursday: arr4f,
        Friday: arr5f,
        Saturday: arr6f
    }
    Trainer.findByIdAndUpdate(req.user._id, {personalSlots: obj}, (err, trainer) => {
        if(err) {
            console.log(err);
        } else {
            console.log(trainer);
        }
    });
})

//Handling Zoom APIs


//Creating User API


route.get('/userInfo',(req,res)=>{
    res.render('zoomEmailVerification.ejs');
});

route.post('/userInfo',(req,res)=>{
    var options = {
        "method": "POST",
        "hostname": "api.zoom.us",
        "port": null,
        "path": "/v2/users?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk",
        "headers": {
          "content-type": "application/json"
        }
    };
    
    var req1 = http.request(options, function (res1) {
        var chunks = [];
      
        res1.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res1.on("end", function () {
          var body = Buffer.concat(chunks);
          body=JSON.parse(body.toString());
          Trainer.findByIdAndUpdate(req.user._id,
            {
                user_id: body.id
            }
            ,(err,result)=>{
                if(err){
                    return res.status(422).json({error: err});
                }
                res.redirect('/');
            });
        });
      });
    
    req1.write(JSON.stringify({ action: 'create',
      user_info: 
       { email: req.user.email,
         type: 1,
         first_name: req.user.username,
        } 
    }));
    
    req1.end();
    
});


// Trainer Profile Display

route.get('/profile/:id/:name', (req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            // console.log(req.params.name)
            res.render('trainerProfile',{trainer:foundTrainer, category: req.params.name});
        }
    });
});



// Creating Meeting API

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

var meetConfig = {
    password:null,
    signature:null,
    meetingNumber:null,
    username:null
};

route.post('/createMeeting',(req,res)=>{
    // email = req.body.email;
    console.log(req.user);
    var options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/shashankaggarwal13@gmail.com",
        qs: {
            status: 'active'
        },
        auth: {
            'bearer': token
        },
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json'
        },
        json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {

      //printing the response on the console
        console.log('Trainer has', response);
   
        meetConfig.meetingNumber = response.pmi.toString();

        meetConfig.username = response.first_name + ' ' + response.last_name;

       res.redirect('/trainer/getMeeting/?id='+response.pmi.toString());
 
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });

});

route.get('/getMeeting',(req,res)=>{

    Trainer.findByIdAndUpdate(req.user._id,
        {
            isCreated:true
        },
        (err,result)=>{
            if(err){
                return res.status(422).json({error: err});
            }
        });

    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/meetings/'+req.query.id,
        headers: {
          authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk'
        }
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        body = JSON.parse(body);
        meetConfig.password = body.password;

        Trainer.findByIdAndUpdate(req.user._id,
            {
                meetingDetails:meetConfig
            },
        (err,result)=>{
            if(err){
                return res.status(422).json({error: err});
            }
        });

        console.log(meetConfig.password);

        res.redirect('/trainer/zoomDashboard');
      });
});

//Pass meeting Details to user route
route.get('/passMeetingDetails/:id',(req,res)=>{
   
    Trainer.findById(req.params.id,(err,foundTrainer)=>{
        if(err) {
            console.log(err);
        } else {
            res.json(foundTrainer.meetingDetails);
        }
    });
});

route.get('/zoomDashboard',(req,res)=>{
    res.render('zoomDashboard.ejs');
});


route.post('/signature',(req,res)=>{

    function generateSignature(apiKey,apiSecret, meetingNumber, role) {
        
        // Prevent time sync issue between client signature generation and zoom 
        const timestamp = new Date().getTime() - 30000
        const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
        const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
        const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
      
        return signature
      }
      
      // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
      signature = generateSignature(config.APIKey, config.APISecret,meetConfig.meetingNumber,1);
      
      meetConfig.signature = signature;

      res.json({meetConfig});

});

module.exports = route;