const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');

const jwt = require('jsonwebtoken');
const config = require('../config/credentials');
const rp = require('request-promise');
var http = require("https");


const route = express.Router();

route.get('/',(req,res)=>{
    res.render('trainerDashboard');
});

route.get('/details',(req,res)=>{
    res.render('details');
});

route.put('/submitDetails',(req,res)=>{
    Trainer.findByIdAndUpdate(req.user._id,
        {
            dob:req.body.dob,
            profilePic:req.body.image,
            about:req.body.about
        }
    ,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

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


// Creating Meeting API

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);


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
        console.log('User has', response);
        //console.log(typeof response);
        
        resp = response
        
        //Adding html to the page
        // var title1 ='<center><h3>Your token: </h3></center>' 
        // var result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
        // var title ='<center><h3>User\'s information:</h3></center>' 
        
        // //Prettify the JSON format using pre tag and JSON.stringify
        // var result = title + '<code><pre style="background-color:#aef8f9;">'+JSON.stringify(resp, null, 2)+ '</pre></code>'
        // res.send(result1 + '<br>' + result);


        res.render('zoomDashboard.ejs',{meetingUrl : 'https://success.zoom.us/wc/join/'+ response.id});

 
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });

});


module.exports = route;