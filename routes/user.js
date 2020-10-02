var express = require('express');
var route = express.Router();

var User = require('../models/user');
var Trainer = require('../models/trainer');

route.get('/', (req, res) => {
    Trainer.find({}, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('userDashboard', {trainers: foundTrainer});
        }
    });
});

module.exports = route;