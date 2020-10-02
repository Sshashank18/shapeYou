const express = require('express');
var passport = require("passport");
const Trainer = require('../models/trainer');
const User = require('../models/user');

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
        dob: req.body.dob
    });
    Trainer.register(newTrainer, req.body.password, (err, trainer) => {
        if (err) {
            console.log(err);
        } else {
            console.log(trainer);
            res.redirect('/waiting');
        }
    })
});


//Create a new User
route.post('/user', (req, res) => {
    var newUser = new User({
        username: req.body.userName,
        email: req.body.userEmail
    });
    User.register(newUser, req.body.userPassword, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            console.log(user);
            res.redirect('/');
        }
    })
})



// Trainer Login form
route.get('/login',(req,res)=>{
    res.render('login');
});

// Login logic
route.post("/trainerLogin", passport.authenticate("trainer-local", 
	{
		successRedirect: "/trainer",
		failureRedirect: "/auth/login"
	}), function(req, res){
        console.log(req.user);
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
route.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = route