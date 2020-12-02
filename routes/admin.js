const express = require('express');
const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Category = require('../models/category');
const User = require('../models/user');
var middleware = require("../middleware");
const e = require('express');

const route = express.Router();

route.get('/', (req, res) => {
    res.redirect('/admin/trainers');
});

route.get('/trainers', (req, res) => {
    Trainer.find({}, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminTrainers', {trainers: foundTrainer});
        }
    });
});

route.get('/users', (req, res) => {
    User.find({}, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminUsers', {users: foundUser});
        }
    });
});

route.get('/trainer/:id', (req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminTrainerProfile', {trainer: foundTrainer});
        }
    });
});

route.put('/trainerVerify/:id', (req, res) => {
    Trainer.findByIdAndUpdate(req.params.id, {isVerified: true}, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/admin/trainers');
        }
    });
});

route.get('/user/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminUserProfile', {user: foundUser});
        }
    })
})

module.exports = route;