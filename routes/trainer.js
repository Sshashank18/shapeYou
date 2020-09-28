const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');

var http = require("https");


const route = express.Router();

route.get('/',(req,res)=>{
    res.render('trainerDashboard');
});

route.get('/details',(req,res)=>{
    res.render('details');
});

route.put('/submitDetails',(req,res)=>{
    Trainer.findByIdAndUpdate(req.user._id,{
        $push: {
                dob:req.body.dob,
                profilePic:req.body.image,
                about:req.body.about
               }
    },{
        new: true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.json(result);
        res.redirect('/');
    });
});

//Handling Zoom APIs


//Creating User API

var options = {
    "method": "POST",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/users?access_token=<TOKEN>",
    "headers": {
      "content-type": "application/json"
    }
};

var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

req.write(JSON.stringify({ action: 'create',
  user_info: 
   { email: 'string',
     type: 1,
     first_name: 'string',
     last_name: 'string',
    } 
}));

req.end();


// Creating Meeting API

route.post('/createMeeting',(req,res)=>{
    
});


module.exports = route;