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

route.get('/', (req, res) => {
    Category.find({}, (err, foundCategories) => {
        if(err) {
            console.log(err);
        } else {
            res.render('userDashboard', {categories: foundCategories});
        }
    })
});

route.get('/category/:id', (req, res) => {
    Category.findById(req.params.id, (err, foundCategory) => {
        Trainer.find({}, (err, foundTrainer) => {
            if(err) {
                console.log(err)
            } else {
                var trainers = [];
                foundTrainer.forEach(function(trainer) {
                    if(trainer.subCategories.indexOf(foundCategory.title) >= 0) {
                        trainers.push(trainer);
                    }
                });
                res.render('categoryShow', {category: foundCategory, trainers: trainers});
            }
        })
    })
})

route.get('/zoomDashboard',(req,res)=>{
    res.render('userZoomDashboard.ejs');
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
        url: 'http://127.0.0.1:3500/trainer/passMeetingDetails',
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