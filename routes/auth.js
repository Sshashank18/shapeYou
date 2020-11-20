const express = require('express');
var passport = require("passport");
const Trainer = require('../models/trainer');
const User = require('../models/user');
var http = require("https");

const route = express.Router();

// =============
// Trainer Auth
// =============

// Trainer register form
route.get('/', (req, res) => {
    res.render('register');
});

// Create a new trainer
route.post('/trainer', (req, res) => {
    var newTrainer = new Trainer({
        username: req.body.trainerName,
        email: req.body.trainerEmail,
        contact: req.body.trainerPhone,
        dob: req.body.dob,
        type: 'Trainer'
    });
    Trainer.register(newTrainer, req.body.password, (err, trainer) => {
        if (err) {
            console.log(err);
        } else {
            console.log(trainer);
            
            req.login(trainer, function (err) {
                if (err){
                    console.log(err);
                } else {
                    res.redirect('/auth/userInfo');
                }
            })
            // res.redirect('/waiting');
        }
    });
});

route.get('/userInfo',(req,res)=>{
    res.render('zoomEmailVerification.ejs');
});

//Create a new User
route.post('/user', (req, res) => {
    var newUser = new User({
        username: req.body.userName,
        email: req.body.userEmail,
        type: "User"
    });
    User.register(newUser, req.body.userPassword, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            console.log(user);
            req.login(user, function (err) {
                if (err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
            // res.redirect('/');
        }
    })
})



// Trainer Login form
route.get('/login',(req,res)=>{
    res.render('login');
});

// Login
route.post("/trainerLogin", passport.authenticate("trainer-local", 
	{
		successRedirect: "/trainer",
		failureRedirect: "/auth/login"
	}), function(req, res){
        console.log(req.user);
        var options = {
            "method": "GET",
            "hostname": "api.zoom.us",
            "port": null,
            "path": `/v2/users/email?email=${req.user.email}`,
            "headers": {
              "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk"
            }
          };

          var req1 = http.request(options, function (res1) {
            var chunks = [];
          
            res1.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res1.on("end", function () {
              var body = Buffer.concat(chunks);
              body = JSON.parse(body.toString());
              console.log(body.existed_email);
            
              if(body.existed_email == true){
                Trainer.findByIdAndUpdate(req.user._id,{isZoomVerified:true},(err,trainer)=>{
                    if(err) console.log(err);
                    else console.log(trainer);
                });
               }

            });
          });
          
          req1.end();

    }
);

// User Login
route.post("/userLogin", passport.authenticate("user-local", 
	{
		successRedirect: "/user",
		failureRedirect: "/auth/login"
	}), function(req, res){
        console.log(req.user);
    }
);


// Logout logic
route.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = route