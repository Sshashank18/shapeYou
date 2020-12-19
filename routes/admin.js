const express = require('express');
const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Category = require('../models/category');
const User = require('../models/user');
const Price = require('../models/pricing');
const Request = require('../models/requestCoupon');
const Admin = require('../models/admin');
var middleware = require("../middleware");
var http = require("https");

const route = express.Router();

route.get('/', middleware.isAdminLoggedIn, (req, res) => {
    res.redirect('/admin/trainers');
});

route.get('/trainers', middleware.isAdminLoggedIn, (req, res) => {
    Trainer.find({}, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminTrainers', {trainers: foundTrainer});
        }
    });
});

route.get('/users', middleware.isAdminLoggedIn, (req, res) => {
    User.find({}, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminUsers', {users: foundUser});
        }
    });
});

route.get('/trainer/:id', middleware.isAdminLoggedIn, (req, res) => {
    Trainer.findById(req.params.id).populate('reviews').exec( (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminTrainerProfile', {trainer: foundTrainer});
        }
    });
});

route.put('/trainerVerify', middleware.isAdminLoggedIn, (req, res) => {

    console.log(req.body);

        var options = {
            "method": "POST",
            "hostname": "api.zoom.us",
            "port": null,
            "path": "/v2/users?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk",
            "headers": {
              "content-type": "application/json"
            }
        };
    
        var req1 = http.request(options, function (res1) {
            var chunks = [];
          
            res1.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res1.on("end", function () {
              var body = Buffer.concat(chunks);
              body=JSON.parse(body.toString());
              Trainer.findByIdAndUpdate(req.body.id,
                {
                    user_id: body.id,
                    isVerified: true
                }
                ,(err,result)=>{
                    if(err){
                        return res.status(422).json({error: err});
                    }
                    res.sendStatus(200);
                });
            });
          });
    
        req1.write(JSON.stringify({ action: 'create',
          user_info: 
           { email: req.body.email,
             type: 1,
            //  first_name: req.user.username,
            } 
        }));
        
        req1.end();
});

route.get('/user/:id', middleware.isAdminLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            res.render('adminUserProfile', {user: foundUser});
        }
    })
});

route.get('/pricing', middleware.isAdminLoggedIn, (req, res) => {
    Price.find({}, (err, foundPrices) => {
        if(err) {
            console.log(err);
        } else {
            res.render('pricing', {prices: foundPrices});
        }
    });
});

route.post('/pricing', middleware.isAdminLoggedIn, (req, res) => {
    Price.create(req.body, (err, price) => {
        if(err) {
            console.log(err);
        } else {
            console.log(price);
            res.redirect('/admin/pricing');
        }
    });
});

route.get('/editPrice', middleware.isAdminLoggedIn, (req, res) => {
    res.render('priceEditForm');
});

route.put('/editPrice', middleware.isAdminLoggedIn, (req, res) => {
    Price.find({title: req.body.segment}, (err, foundPrice) => {
        if(err) {
            console.log(err);
        } else {
            if(req.body.trialnumOfSessions) {
                foundPrice[0].trialnumOfSessions = req.body.trialnumOfSessions;
            }
            if(req.body.trialPackPrice) {
                foundPrice[0].trialPackPrice = req.body.trialPackPrice;
            }
            if(req.body.goldnumOfSessions) {
                foundPrice[0].goldnumOfSessions = req.body.goldnumOfSessions;
            }
            if(req.body.goldPackPrice) {
                foundPrice[0].goldPackPrice = req.body.goldPackPrice;
            }
            if(req.body.platinumnumOfSessions) {
                foundPrice[0].platinumnumOfSessions = req.body.platinumnumOfSessions;
            }
            if(req.body.platinumPackPrice) {
                foundPrice[0].platinumPackPrice = req.body.platinumPackPrice;
            }
            foundPrice[0].save();
            console.log(foundPrice);
            res.redirect('/admin');
        }
    })
});

route.get('/couponRequests', middleware.isAdminLoggedIn, (req, res) => {
    Request.find({}, (err, requests) => {
        res.render('couponRequests', {requests: requests});
    });
});

route.put('/approveCoupon/:id/:requestid', middleware.isAdminLoggedIn, (req, res) => {
    Request.findById(req.params.requestid, (err, request) => {
        if(err) {
            console.log(err);
        } else {
            Trainer.findByIdAndUpdate(req.params.id, { coupon:request.coupon } ,(err,result)=>{
                    if(err){
                        return res.status(422).json({error: err});
                    } else {
                        request.remove();
                        res.redirect('/admin');
                    }
                });
        }
    });
});

route.put('/trainerPack/:id', middleware.isAdminLoggedIn, (req, res) => {
   
            Trainer.findByIdAndUpdate(req.params.id, {pricePlan: req.body.trainerPack}, (err, foundTrainer) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(foundTrainer);
                    res.redirect('/admin/trainer/' + foundTrainer._id);
                }
            });
});

route.put('/upgrade/:id', (req, res) => {
    Trainer.findByIdAndUpdate(req.params.id, {pricePlan: req.body.pricePlan}, (err, trainer) => {
        if(err) {
            console.log(err);
        } else {
            console.log(trainer.pricePlan);
            res.redirect('/admin/trainer/' + req.params.id);
        }
    })
});

module.exports = route;