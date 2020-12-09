const express = require('express');
const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Category = require('../models/category');
const User = require('../models/user');
const Price = require('../models/pricing');
const Request = require('../models/requestCoupon');
var middleware = require("../middleware");

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
            res.redirect('/admin/trainer/' + req.params.id);
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
});

route.get('/pricing', (req, res) => {
    Price.find({}, (err, foundPrices) => {
        if(err) {
            console.log(err);
        } else {
            res.render('pricing', {prices: foundPrices});
        }
    });
});

route.post('/pricing', (req, res) => {
    Price.create(req.body, (err, price) => {
        if(err) {
            console.log(err);
        } else {
            console.log(price);
            res.redirect('/admin/pricing');
        }
    });
});

route.get('/editPrice', (req, res) => {
    res.render('priceEditForm');
});

route.put('/editPrice', (req, res) => {
    Price.find({title: req.body.segment}, (err, foundPrice) => {
        if(err) {
            console.log(err);
        } else {
            console.log(foundPrice);
            res.redirect('/admin');
        }
    })
});

route.get('/couponRequests', (req, res) => {
    Request.find({}, (err, requests) => {
        res.render('couponRequests', {requests: requests});
    });
});

route.put('/approveCoupon/:id/:requestid', (req, res) => {
    Request.findById(req.params.requestid, (err, request) => {
        if(err) {
            console.log(err);
        } else {
            Trainer.findByIdAndUpdate(req.params.id, { coupon:request.coupon } ,(err,result)=>{
                    if(err){
                        return res.status(422).json({error: err});
                    }
                    res.sendStatus(200);
                });
        }
    })
});

module.exports = route;