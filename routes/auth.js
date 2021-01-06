const express = require('express');
var passport = require("passport");
const Trainer = require('../models/trainer');
const User = require('../models/user');
const Admin = require('../models/admin');
var http = require("https");


const route = express.Router();

// =============
// Trainer Auth
// =============

// Trainer register form
route.get('/', (req, res) => {
    const errors = req.flash().error || [];
    res.render('register', {errors});
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
                    res.redirect('/trainer/trainerForm');
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
    const errors = req.flash().error || [];
    res.render('login', {errors});
});

// Trainer login
route.post("/trainerLogin", passport.authenticate("trainer-local", 
	{
        successRedirect: "/trainer",
        failureFlash: true,
		failureRedirect: "/auth/login"
    }),
    function(req, res){
        console.log(req.user);
    }
);

// User Login
route.post("/userLogin", passport.authenticate("user-local", 
	{
        successRedirect: "/user",
        failureFlash: true,
		failureRedirect: "/auth/login"
	}), function(req, res){
        console.log(req.user);
    }
);

// Admin
route.get('/admin', (req, res) => {
    res.render('adminLogin');
});

route.post('/admin', 
passport.authenticate("admin",
    {
        successRedirect: '/admin',
        failureRedirect: '/user'
    }
),
 (req, res) => {

    // var newAdmin = new Admin({
    //     email: req.body.email,
    //     type: "Admin"
    // });
    // Admin.register(newAdmin, req.body.password, (err, admin) => {
    //     if(err){
    //         console.log(err); 
    //     } else {
    //         console.log(admin);
    //     }
    // })  
    // Admin.findOne({email: req.body.email}, (err, admin) => {
    //     console.log(admin);
    // })     
    console.log(req.user);
});


// Logout logic
route.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged you out');
    res.redirect('/');
});

module.exports = route