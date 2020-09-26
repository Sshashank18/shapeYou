const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');

const route = express.Router();

route.get('/register', (req, res) => {
    res.render('register');
});

route.post('/register', (req, res) => {
    var newTrainer = new Trainer({
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        dob: req.body.dob
    });
    Trainer.register(newTrainer, req.body.password, (err, trainer) => {
        if (err) {
            console.log(err);
        } else {
            res.render('waiting');
        }
    })
});

module.exports={
    route
}