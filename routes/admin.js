const express = require('express');
const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Category = require('../models/category');
const Pricing = require('../models/pricing');
const User = require('../models/user');
const Price = require('../models/pricing');
const Request = require('../models/requestCoupon');
const Admin = require('../models/admin');
const Report = require('../models/report');
var middleware = require("../middleware");
var http = require("https");

const route = express.Router();

route.get('/', middleware.isAdminLoggedIn, (req, res) => {
    req.flash("success", "Welcome");
    res.redirect('/admin/trainers');
});

route.get('/trainers', middleware.isAdminLoggedIn, (req, res) => {
    Trainer.find({}, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            foundTrainer.reverse();
            res.render('adminTrainers', {trainers: foundTrainer});
        }
    });
});

route.get('/users', middleware.isAdminLoggedIn, (req, res) => {
    User.find({}, (err, foundUser) => {
        if(err) {
            console.log(err);
        } else {
            foundUser.reverse();
            res.render('adminUsers', {users: foundUser});
        }
    });
});



trainerSort = trainers =>{

    return trainers.sort((a,b)=>{
        avg1 = a.avgRating;
        avg2 = b.avgRating;
    
        if(avg1 > avg2) return 1;
        else return -1;
    
    });

};

route.get('/category/:parent', middleware.isAdminLoggedIn, (req, res) => {
    var parent = req.params.parent;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Category.find({parent:req.params.parent}, (err, foundCategory) => { 
            Trainer.find({username: regex}, (err, foundTrainers) => {
                if(err) {
                    console.log(err);
                } else {
                    var noMatch = "";
                    if(foundTrainers.length == 0) {
                        noMatch = "No such trainers exist";
                    } 
                    res.render('categoryShow1', {category: foundCategory[0], trainer: foundTrainers[0], noMatch: noMatch, parent: parent,type:req.user.type});
                }
            });
        });
    } else {
    Category.find({parent:req.params.parent}, (err, foundCategory) => { 
        var titles = [];
        var trainers = [];
        var sortedTrainers = null;
        var foundTrainers = null;
        for(var i=0;i<foundCategory.length;i++){
            titles.push(foundCategory[i].title);
        }

        Trainer.find({}).populate('reviews').exec( (err, foundTrainer) => {
            if(err) {
                console.log(err)
            } else {
                sortedTrainers = trainerSort(foundTrainer);
                foundTrainers = foundTrainer;

                setTimeout(() => {
                    if(sortedTrainers){
                        // console.log(sortedTrainers)
                        sortedTrainers.forEach(trainer =>{ 
                            if(trainer.subCategories && trainer.subCategories.length>0){
                                for (var i=0;i<trainer.subCategories.length;i++){
            
                                    if(titles.indexOf(trainer.subCategories[i]) in titles===true){
                                        if (trainers.indexOf(trainer) in trainers==true){
                                            continue;
                                        }else{
                                            trainers.push(trainer);
                                        }
                                    }
                                }
                            }
                        });
                            res.render('categoryShow', {category: foundCategory[0], trainers: trainers, parent: parent ,type:req.user.type})
                    }else{
                        foundTrainers.forEach(trainer =>{ 
                            if(trainer.subCategories && trainer.subCategories.length>0){
                                for (var i=0;i<trainer.subCategories.length;i++){
            
                                    if(titles.indexOf(trainer.subCategories[i]) in titles===true){
                                        if (trainers.indexOf(trainer) in trainers==true || req.user.trainers.find(el => el.id == trainer._id)){
                                            continue;
                                        }else{
                                            trainers.push(trainer);
                                        }
                                    }
                                }
                            }
                        });
                            res.render('categoryShow', {category: foundCategory[0], trainers: trainers, parent: parent ,type:req.user.type})
                    }
                }, 500);
            }
        });
            });
        }
    });


route.get('/trainer/profile/:id/:name', middleware.isAdminLoggedIn,(req, res) => {
    Trainer.findById(req.params.id).populate(['reviews']).exec( (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            Pricing.find({},(err,result)=>{
                result.forEach((title)=>{
                if(title.title == foundTrainer.pricePlan){

                    var pricing = {
                        trialNumofSessions: title.trialnumOfSessions,
                        trialPackPrice: title.trialPackPrice,
                        trialPackDiscount: title.trialPackDiscount,
                        trialBasicSegement: title.trialBasicSegement,
                        trialPerSessionAmount: title.trialPerSessionAmount,
                        goldNumofSessions: title.goldnumOfSessions,
                        goldPackPrice: title.goldPackPrice,
                        goldPackDiscount: title.goldPackDiscount,
                        goldBasicSegement: title.goldBasicSegement,
                        goldPerSessionAmount: title.goldPerSessionAmount,
                        platinumNumofSessions: title.platinumnumOfSessions,
                        platinumPackPrice: title.platinumPackPrice,
                        platinumPackDiscount: title.platinumPackDiscount,
                        platinumBasicSegement: title.platinumBasicSegement,
                        platinumPerSessionAmount: title.platinumPerSessionAmount,
                    }

                    res.render('trainerProfile',{trainer:foundTrainer, category: req.params.name,pricing});
                }
            });
                
            });
        }
    });
});


route.get('/trainer/:id', middleware.isAdminLoggedIn, (req, res) => {
    Trainer.findById(req.params.id).populate(['reviews', 'reports']).exec( (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            console.log(foundTrainer.subcategories)
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
            if(req.body.trialValidity) {
                foundPrice[0].trialValidity = req.body.trialValidity;
            }
            if(req.body.goldnumOfSessions) {
                foundPrice[0].goldnumOfSessions = req.body.goldnumOfSessions;
            }
            if(req.body.goldPackPrice) {
                foundPrice[0].goldPackPrice = req.body.goldPackPrice;
            }
            if(req.body.goldValidity) {
                foundPrice[0].goldValidity = req.body.goldValidity;
            }
            if(req.body.platinumnumOfSessions) {
                foundPrice[0].platinumnumOfSessions = req.body.platinumnumOfSessions;
            }
            if(req.body.platinumPackPrice) {
                foundPrice[0].platinumPackPrice = req.body.platinumPackPrice;
            }
            if(req.body.platinumValidity) {
                foundPrice[0].platinumValidity = req.body.platinumValidity;
            }
            foundPrice[0].save();
            console.log(foundPrice);
            req.flash('success', "Successfully Updated!");
            res.redirect('/admin/trainers');
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

route.put('/rejectCoupon/:id/:requestid', middleware.isAdminLoggedIn, (req, res) => {
    Request.findById(req.params.requestid, (err, request) => {
        if(err) {
            console.log(err);
        } else {
       
            request.remove();
            res.redirect('/admin');
      
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

route.get('/reports', middleware.isAdminLoggedIn, (req, res) => {
    Report.find({}, (err, reports) => {
        if(err) {
            console.log(err);
        } else {
            reports.reverse();
            res.render('adminReports', {reports: reports});
        }
    });
});

route.get('/changepassword', (req, res) => {
    res.render('adminPassword');
})

route.post('/changepassword', (req, res) => {
    Admin.findById(req.user._id, (err, admin) => {
        if(err) {
            console.log(err);
        } else {
            admin.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
                if(err) {
                    req.flash('error', "Something went wrong");
                    res.redirect('/admin/trainers');
                } else {
                    req.flash('success', 'Password changed');
                    res.redirect('/admin/trainers');
                }
            })
        }
    })
});

module.exports = route;