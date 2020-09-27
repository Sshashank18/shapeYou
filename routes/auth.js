const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');

const route = express.Router();

route.get('/', (req, res) => {
    res.render('register');
});

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

module.exports = route