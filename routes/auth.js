const express = require('express');
var passport = require("passport");
const Trainer = require('../models/trainer');

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

// Login form
route.get('/login', (req, res) => {
    res.render('login');
});

// Login logic
route.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/trainer",
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