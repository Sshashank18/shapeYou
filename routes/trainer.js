const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');
const Category = require('../models/category');
const Pricing = require('../models/pricing');
const Request = require('../models/requestCoupon');
const Review = require('../models/reviews');
const Report = require('../models/report');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const config = require('../config/credentials');
const rp = require('request-promise');
var http = require("https");
var middleware = require("../middleware");
const request = require('request');
const e = require('express');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


const route = express.Router();

route.get('/',middleware.isTrainerLoggedIn, (req,res)=>{
    
    var options = {
        "method": "GET",
        "hostname": "api.zoom.us",
        "port": null,
        "path": `/v2/users/email?email=${req.user.email}`,
        "headers": {
          "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk"
        }
      };

      var req1 = http.request(options, function (res1) {
        var chunks = [];
      
        res1.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res1.on("end", function () {
          var body = Buffer.concat(chunks);
          body = JSON.parse(body.toString());
          console.log(body.existed_email);
        
          if(body.existed_email == true){
            Trainer.findByIdAndUpdate(req.user._id,{isZoomVerified:true,isCreated:false},(err,trainer)=>{
                if(err) console.log(err);
                else console.log('zoom verified');
            });
           }
        //    Trainer.findById(req.user._id).populate('users').exec( (err,trainer)=>{
        //     res.render('trainerDashboard', {trainer:trainer});
        // });
        Trainer.findById(req.user._id,(err,trainer)=>{
            // req.flash('success', 'Welcome to the trainer dashboard!');
            res.render('trainerDashboard',{trainer:trainer, success: "Welcome to the trainer dashboard"})
        })
        });
      });
      
      req1.end();
  
});


//Uploading to Spaces Digital ocean

const path = require('path');

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: '22CB4ZCNMX2ABRU6ROOF',
  secretAccessKey: 'KlemSL69iF6H771XTWefnjsTOB+Y13WOS6Hgdw3JYmY'
});


const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'shapeyou/trainerProfiles',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, request.user.username + '-' + Date.now() + path.extname(file.originalname));
      }
    }),
    limits:{fileSize: 1000000},  //1MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
  }).single('file');

const upload2 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'shapeyou/trainerAadhar',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, request.user.username + '-' + Date.now() + path.extname(file.originalname));
      }
    }),
    limits:{fileSize: 1000000},  //1MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
  }).single('file');

const upload3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'shapeyou/trainerResume',
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, request.user.username + '-' + Date.now() + path.extname(file.originalname));
      }
    }),
    limits:{fileSize: 1000000},  //1MB
    fileFilter: function(req, file, cb){
        checkFileType2(file, cb);
    }
  }).single('file');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb({message:'Error: Images Only!'});
    }
  }

function checkFileType2(file, cb){
    // Allowed ext
    const filetypes = /doc|docx|odt|pdf|tex|txt|rtf|wps|wks|wpd/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb({message:'Error: File Only!'});
    }
  }

route.post('/uploadImg',(req,res)=>{
    upload(req, res, (err) => {
        if(err){
            return res.status(200).send({message: err.message});
        } else {
          if(req.file == undefined){
            return res.status(200).send({
                message: 'Please upload image!!'
             });
          } else {
            Trainer.findByIdAndUpdate(req.user._id,{profilePic:req.file.location},(err,foundTrainer)=>{
                if(err) return res.status(422).json({error: err});
                return res.status(200).json({message:'Image Uploaded Sucessfully!!'});
            });
          }
        }
      });
});

route.put('/uploadImg',(req,res)=>{
    upload(req, res, (err) => {
        if(err){
            return res.status(200).send({message: err.message});
        } else {
          if(req.file == undefined){
            return res.status(200).send({
                message: 'Please upload image!!'
             });
          } else {
            Trainer.findByIdAndUpdate(req.user._id,{profilePic:req.file.location},(err,foundTrainer)=>{
                if(err) return res.status(422).json({error: err});
                return res.status(200).json({message:'Image Uploaded Sucessfully!!'});
            });
          }
        }
      });
});

route.post('/uploadAadhar',(req,res)=>{
    upload2(req, res, (err) => {
        if(err){
            return res.status(200).send({message: err.message});
        } else {
          if(req.file == undefined){
            return res.status(200).send({
                message: 'Please Upload Aadhar!!'
             });
          } else {
            Trainer.findByIdAndUpdate(req.user._id,{aadhar:req.file.location},(err,foundTrainer)=>{
                if(err) return res.status(422).json({error: err});
                return res.status(200).json({message:'Aadhaar Uploaded Sucessfully!!'});
            });
          }
        }
      });
});

route.post('/uploadCV',(req,res)=>{
    upload3(req, res, (err) => {
        if(err){
            return res.status(200).send({message: err.message});
        } else {
          if(req.file == undefined){
            return res.status(200).send({
                message: 'Please upload Resume!!'
             });
          } else {
            Trainer.findByIdAndUpdate(req.user._id,{resume:req.file.location},(err,foundTrainer)=>{
                if(err) return res.status(422).json({error: err});
                return res.status(200).json({message:'Resume Uploaded Sucessfully!!'});
            });
          }
        }
      });
});
 
route.get('/details',middleware.isTrainerLoggedIn,(req,res)=>{
    res.render('details');
});

route.get('/getDetails',(req,res)=>{
    Trainer.findById(req.user._id,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

route.get('/aadhar',(req,res)=>{
    Trainer.findById(req.user._id,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        if(result.aadhar != null){
            return res.json(result);
        }else{
            return res.status(200).json({message:'Upload Aadhar !!'});
        }
    });
});

route.put('/submitDetails',(req,res)=>{
    
    Trainer.findById(req.user._id,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        if(req.body.name != ""){
            result.username = req.body.name;
        }
        if(req.body.address != ""){
            result.address = req.body.address;
        }
        if(req.body.contact != ""){
            result.contact = req.body.contact;
        }
        if(req.body.alternateContact != ""){
            result.alternateContact = req.body.alternateContact;
        }
        if(req.body.amount != ""){
            result.amount = req.body.amount;
        }
        if(req.body.experienceYears != ""){
            result.experienceYears = req.body.experienceYears;
        }
        if(req.body.experiencePlace != ""){
            result.experiencePlace = req.body.experiencePlace;
        }
        if(req.body.website != ""){
            result.website = req.body.website;
        }
        if(req.body.socialHandle != ""){
            result.socialHandle = req.body.socialHandle;
        }
        if(req.body.education != ""){
            result.education = req.body.education;
        }
        if(req.body.certification != ""){
            result.certification = req.body.certification;
        }
        if(req.body.about != ""){
            result.about = req.body.about;
        }
        if(req.body.payment != []){
            result.payment = req.body.payment;
        }
        result.save();
        res.sendStatus(200);
    });
});

route.put('/registerForm',(req,res)=>{
    Trainer.findByIdAndUpdate(req.user._id,{
        username:req.body.name,
        dob:req.body.dob,
        address:req.body.address,
        contact:req.body.contact,
        alternateContact:req.body.alternateContact,
        amount:req.body.amount,
        experiencePlace:req.body.experiencePlace,
        experienceYears:req.body.experienceYears,
        about:req.body.about,
        certification:req.body.certification,
        education:req.body.education,
        socialHandle:req.body.socialHandle,
        website:req.body.website,
        referral:req.body.referral,
        payment:req.body.payment,
        timings:req.body.timings,
        subCategories: req.body.subcategories,
        formFilled:true,
    },(err,result)=>{
        if(err) return res.status(422).json({error:err})
        res.json(result);
    });
});


// TRAINER FORM REGISTRATION FOR STEP 2
route.get('/trainerForm', middleware.isTrainerLoggedIn,(req, res) => {
    res.render('trainerRegisterForm.ejs');
})

// route.get('/:type', (req, res) => {
//     Trainer.find({categoryType: req.params.type}, (err, foundTrainer) => {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('trainerType', {trainers: foundTrainer});
//         }
//     });
// });


route.get('/getTimeTable/:id',(req,res)=>{
    Trainer.findById(req.params.id,(err,result)=>{
        res.json(result.calendar);
    });
})

route.put('/setTimeTable/:id',(req,res)=>{
    Trainer.findByIdAndUpdate(req.params.id,
        {
            calendar:req.body
        }
    ,(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.sendStatus(200);
    });
});


route.post('/addCoupon/:id', middleware.isTrainerLoggedIn, (req,res)=>{
    console.log(req.body);
    Trainer.findById(req.params.id, (err, trainer) => {
        if(err) {
            console.log(err);
        } else {
            var request = {
                    id: req.params.id,
                    username: trainer.username,
                    coupon: {
                        couponName: req.body.couponCode.toUpperCase(),
                        couponDiscount: req.body.couponDiscount + '%'
                    }
            }
            Request.create(request, (err, request) => {
                if(err) {
                    console.log(err);
                    req.flash('error', 'Something went wrong, please try again!');
                } else {
                    console.log(request);
                    req.flash('success', 'Request has been sent to the admin for verification!');
                    res.redirect('/trainer')
                }
            });
        }
    })
    // Trainer.findByIdAndUpdate(req.params.id,
    //     {
    //         coupon:req.body
    //     }
    // ,(err,result)=>{
    //     if(err){
    //         return res.status(422).json({error: err});
    //     }
    //     res.sendStatus(200);
    // });
});



route.put('/personalSlots', (req, res) => {
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    const arr4 = [];
    const arr5 = [];
    const arr6 = [];
    const arr7 = [];
    if(req.body.Monday) arr1.push(req.body.Monday);
    if(req.body.Tuesday) arr2.push(req.body.Tuesday);
    if(req.body.Wednesday) arr3.push(req.body.Wednesday);
    if(req.body.Thursday) arr4.push(req.body.Thursday);
    if(req.body.Friday) arr5.push(req.body.Friday);
    if(req.body.Saturday) arr6.push(req.body.Saturday);
    if(req.body.Sunday) arr7.push(req.body.Sunday);
    var arr1f = Array.prototype.concat.apply([], arr1);
    var arr2f = Array.prototype.concat.apply([], arr2);
    var arr3f = Array.prototype.concat.apply([], arr3);
    var arr4f = Array.prototype.concat.apply([], arr4);
    var arr5f = Array.prototype.concat.apply([], arr5);
    var arr6f = Array.prototype.concat.apply([], arr6);
    var arr7f = Array.prototype.concat.apply([], arr7);
    const obj = 
    {
        Monday: arr1f,
        Tuesday: arr2f,
        Wednesday: arr3f,
        Thursday: arr4f,
        Friday: arr5f,
        Saturday: arr6f,
        Sunday: arr7f
    }
    Trainer.findByIdAndUpdate(req.user._id, {personalSlots: obj}, (err, trainer) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'Succesfully updated the personal slots!');
            res.redirect('/trainer');
        }
    });
});

//Handling Zoom APIs


//Creating User API

route.post('/userInfo',(req,res)=>{
    console.log(req.user);
    console.log('break');
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
          Trainer.findByIdAndUpdate(req.user._id,
            {
                user_id: body.id
            }
            ,(err,result)=>{
                if(err){
                    return res.status(422).json({error: err});
                }
                res.redirect('/');
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

route.get('/meetingDetails',middleware.isTrainerLoggedIn,(req,res)=>{

    var uuid = null;
    Trainer.findById(req.user._id,(err,trainer)=>{
        if(err) console.log(err);
        else{
        uuid = trainer.meetingDetails.uuid;

        setTimeout(()=>{
            var options = {
                "method": "GET",
                "hostname": "api.zoom.us",
                "port": null,
                "path": "/v2/past_meetings/"+uuid,
                "headers": {
                  "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk"
                }
              };
              var req1 = http.request(options, function (res1) {
                var chunks = [];
        
                res1.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res1.on("end", function () {
                    var body = Buffer.concat(chunks);
                    body = JSON.parse(body.toString());
                      console.log(body);
                        var meetingLogs = {
                            uuid:body.uuid,
                            id: body.id,
                            user_name:body.user_name,
                            user_email:body.user_email,
                            start_time:body.start_time,
                            end_time:body.end_time,
                            duration:body.duration,
                            total_minutes:body.total_minutes,
                            participants_count:body.participants_count,
                            participants_user: new Array()
                        }

                        trainer.meetingLogs.push(meetingLogs);
                        trainer.meetingDetails = null;
                        trainer.markModified('meetingLogs');
                        trainer.markModified('meetingDetails');
                        trainer.save();
                    
                      });
                      res.redirect('/trainer');
                    });
                    req1.end();
                },2000);
        }

    });
        
});


// Trainer Profile Display

route.get('/profile/:id/:name', middleware.isUserLoggedIn,(req, res) => {
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
                        goldValidity: title.goldValidity,
                        platinumNumofSessions: title.platinumnumOfSessions,
                        platinumPackPrice: title.platinumPackPrice,
                        platinumPackDiscount: title.platinumPackDiscount,
                        platinumBasicSegement: title.platinumBasicSegement,
                        platinumPerSessionAmount: title.platinumPerSessionAmount,
                        platinumValidity: title.platinumValidity,
                    }

                    res.render('trainerProfile',{trainer:foundTrainer, category: req.params.name,pricing});
                }
            });
                
            });
        }
    });
});



// Creating Meeting API

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

var meetConfig = {
    password:null,
    signature:null,
    meetingNumber:null,
    username:null,
    uuid:null
};

route.post('/createMeeting',(req,res)=>{
    // email = req.body.email;
    console.log(req.user);

    var options = {
      "method": "POST",
      "hostname": "api.zoom.us",
      "port": null,
      "path": `/v2/users/${req.user.user_id}/meetings`,
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk"
      }
    };
    
    var req2 = http.request(options, function (res2) {
      var chunks = [];
    
      res2.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res2.on("end", function () {
        var body = Buffer.concat(chunks);
        var response = JSON.parse(body.toString());
        console.log(response);

        meetConfig.meetingNumber = response.id;

        meetConfig.username = req.user.username;

        meetConfig.uuid = response.uuid;

       res.redirect('/trainer/getMeeting/'+response.id);

      });
    });
    
    req2.write(JSON.stringify({type: 1,settings:{"use_pmi":true}}));
    req2.end();

    // rp(options)
    // .then(function (response) {

    //   //printing the response on the console
    //     console.log('Trainer has', response);
   
    //     meetConfig.meetingNumber = response.pmi.toString();

    //     meetConfig.username = response.first_name + ' ' + response.last_name;

    //    res.redirect('/trainer/getMeeting/?id='+response.pmi.toString());
 
    // })
    // .catch(function (err) {
    //     // API call failed...
    //     console.log('API call failed, reason ', err);
    // });


});

route.get('/getMeeting/:id',(req1,res1)=>{

    console.log(req1.params.id);

        var options = {
            "method": "GET",
            "hostname": "api.zoom.us",
            "port": null,
            "path": "/v2/meetings/"+req1.params.id,
            "headers": {
              "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImxlcFBlVFJzUm82QXA1eDVDYjVnS1EiLCJleHAiOjE2MzI5MTUxMjAsImlhdCI6MTYwMTM3MzgwMn0.fk7wLdI0ZQ94KReS8xe1CjpFSCfALdq3hKOhjQR_sZk"
            }
          };

          var req = http.request(options, function (res) {
            var chunks = [];
          
            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function () {
              var body = Buffer.concat(chunks);
              body= JSON.parse(body.toString());
              console.log(body);

              meetConfig.password = body.password;

              Trainer.findByIdAndUpdate(req1.user._id,
                  {
                      meetingDetails:meetConfig,
                      isCreated:true
                  },
              (err,result)=>{
                  if(err){
                      return res1.status(422).json({error: err});
                  }
              });
      
              console.log(meetConfig.password);
              res1.redirect('/zoomDashboard');
            //   res1.render('zoomDashboard');
            
            });
          });
          
          req.end();
      
});

//Pass meeting Details to user route
route.get('/passMeetingDetails/:id',(req,res)=>{
   
    Trainer.findById(req.params.id,(err,foundTrainer)=>{
        if(err) {
            console.log(err);
        } else {
            res.json(foundTrainer.meetingDetails);
        }
    });
});


route.post('/signature',(req,res)=>{

    function generateSignature(apiKey,apiSecret, meetingNumber, role) {
        
        // Prevent time sync issue between client signature generation and zoom 
        const timestamp = new Date().getTime() - 30000
        const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
        const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
        const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
      
        return signature
      }
      
      // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
      signature = generateSignature(config.APIKey, config.APISecret,meetConfig.meetingNumber,1);
      meetConfig.signature = signature;

      console.log(meetConfig);
      res.json({meetConfig});

});

// FEEDBACK ROUTING

route.get('/:id/review', middleware.isUserLoggedIn,(req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            res.render('feedback', {trainer: foundTrainer});
        }
    });
});

let average = (array) => {
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var n5 = 0;

    for(var i = 0;i<array.length;i++){
        if(array[i]==1){
            n1++;
        }else if(array[i]==2){
            n2++;
        }else if(array[i]==3){
            n3++;
        }else if(array[i]==4){
            n4++;
        }else{
            n5++;
        }
    }

    avg = (1*n1 + 2*n2 + 3*n3 + 4*n4 + 5*n5)/5;
    return avg;
};

route.post('/:id/review', (req, res) => {
    Trainer.findById(req.params.id).populate('reviews').exec((err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            var review = {
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                body: req.body.review.message,
                rating: req.body.review.rating
            }
            Review.create(review, (err, review) => {
                if(err) {
                    console.log(err);
                } else {
                    foundTrainer.reviews.push(review);
                    avg = []
                    foundTrainer.reviews.forEach(review => {
                        avg.push(review.rating);
                    })

                    avg = average(avg);
                    avg = Math.round(avg);
                    foundTrainer.avgRating = avg;

                    foundTrainer.markModified('avgRating');
                    foundTrainer.save();
                    req.flash('success', 'Review submitted!');
                    // res.send("Review submitted") 
                    res.redirect('/user/userDashboard/'+req.user._id);
                }
            });


        }
    });

    // Trainer.find({}).populate('reviews').exec( (err, foundTrainer) => {

});

route.post('/:id/report', (req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        if(err) {
            console.log(err);
        } else {
            var report = {
                trainerName: req.body.trainerName,
                trainerId: req.body.trainerId,
                category: req.body.category,
                issue: req.body.issue,
                author: {
                    username: req.user.username,
                    id: req.user._id
                }
            }
            Report.create(report, (err, report) => {
                if(err) {
                    console.log(err);
                } else {
                    foundTrainer.reports.push(report);
                    req.flash('success', 'Successfully reported!');
                    res.redirect('/user/userDashboard/'+req.user._id);
                }
            })
        }
    });
});


module.exports = route;