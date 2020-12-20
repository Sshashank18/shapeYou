var express = require('express');
var route = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/credentials');
const rp = require('request-promise');
var https = require("https");
const request = require('request');
const passport = require('passport');

var User = require('../models/user');
var Trainer = require('../models/trainer');
var Category = require('../models/category');
var _ = require('agile');
var middleware = require("../middleware");
// var payment = require("../middleware/payment")(route);
// const PaytmChecksum = require('./PaytmChecksum');


// function payment(req,res,next){
route.post('/paytm',middleware.isUserLoggedIn,(req,res)=>{

    const shortid = require('shortid');
    const checksum_lib = require('./checksum/checksum');
	
        const orderId = shortid.generate();
        const customerId = shortid.generate();

        // var paytmParams = {};

        // var paytmParams = {
        //     "requestType"   : "Payment",
        //     "mid"           : "cuZBeb01092536643568",
        //     "websiteName"   : "WEBSTAGING",
        //     "orderId"       : "ORDERID_98765",
        //     "callbackUrl"   : "https://merchant.com/callback",
        //     "txnAmount"     : {
        //         "value"     : "1.00",
        //         "currency"  : "INR",
        //     },
        //     "userInfo"      : {
        //         "custId"    : "CUST_001",
        //     },
        // };

        var price = null;

        if(req.body.price != undefined){
            price = req.body.price;
        }else{
            price = req.body.defaultPrice;
        }

        var paytmParams = {
            "MID" : "cuZBeb01092536643568",
            "WEBSITE" : "DEFAULT",
            "INDUSTRY_TYPE_ID" : "Retail",
            "CHANNEL_ID" : "WEB",
            "ORDER_ID" : orderId,
            "CUST_ID" : req.body.trainerId,
            // "MOBILE_NO" : r,
            "EMAIL" : req.user.email,
            "TXN_AMOUNT" : price,
            // "CALLBACK_URL" :`${DOMAIN}success?name=${req.query.name}&email=${req.query.email}&mobile=${req.query.mobile}&branch=${req.query.branch}&year=${req.query.year}&college=${req.query.college}&event=${req.query.event}&amount=${req.query.amount}`,
            "CALLBACK_URL" :`http://127.0.0.1:3500/user/newSession?body=${encodeURIComponent( JSON.stringify(req.body) )}&id=${req.user._id}`,
            // "CALLBACK_URL" :`http://127.0.0.1:3500/user/success?trainerId=${req.body.trainerId}&category=${req.body.category}&type=${req.body.type}&username=${req.body.username}&numOfSessions=${req.body.numOfSessions}&booked=${req.body.booked}`,
        };
        
        checksum_lib.genchecksum(paytmParams, "u#R7ezMHf4rNiJ3J", function(err, checksum){
            
            // var url = "https://securegw.paytm.in/order/process";
            var url = "https://securegw-stage.paytm.in/order/process"   //For testing purposes
    
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html>');
            res.write('<head>');
            res.write('<title>Merchant Checkout Page</title>');
            res.write('</head>');
            res.write('<body>');
            res.write('<center><h1>Please do not refresh this page...</h1></center>');
            res.write('<form method="post" action="' + url + '" name="paytm_form">');
            for(var x in paytmParams){
                res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
            }
            res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
            res.write('</form>');
            res.write('<script type="text/javascript">');
            res.write('document.paytm_form.submit();');
            res.write('</script>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        });
});

      

route.get('/', (req, res) => {
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Category.find({title: regex}, (err, foundCategories) => {
            if(err) {
                console.log(err);
            } else {
                var noMatch = "";
                if(foundCategories.length < 1) {
                    noMatch = "No categories found, please try again!";
                }
                res.render('index1', {categories: foundCategories, noMatch: noMatch});
            }
        })
    } else {
    Category.find({}, (err, foundCategories) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {categories: foundCategories});
        }
    })
}
    // res.render('index');
});


route.get('/isCreated/:id',(req,res)=>{
    Trainer.findById(req.params.id,(err,trainer)=>{
        if(err){
            console.log(err);
        }else{
            var isCreated = trainer.isCreated;
            res.json({isCreated});
        }
    });
});

route.get('/bookedSlots/:id',(req, res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err);
        }else{
            res.json(user.bookedSlot);
        }
    });
    });


    
let average = (array) => {
    if(array.length>1){
        return array.reduce((a, b) => a + b) / 5.0;
    }else if(array.length == 1){
        return array[0];
    }else{
        return 0;
    }
};


trainerSort = trainers =>{

    return trainers.sort((a,b)=>{
        avg1 = []
        avg2 = []
        a.reviews.forEach(review =>{
            avg1.push(review.rating);
        })
        b.reviews.forEach(review =>{
            avg2.push(review.rating);
        })

        avg1 = average(avg1);
        avg2 = average(avg2);
    
        if(avg1 > avg2) return -1;
        else return 1;
    
    });

};

route.get('/category/:parent', middleware.isUserLoggedIn, (req, res) => {
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
                    res.render('categoryShow1', {category: foundCategory[0], trainer: foundTrainers, noMatch: noMatch, parent: parent});
                }
            });
        });
    } else {
    Category.find({parent:req.params.parent}, (err, foundCategory) => { 
        var titles = [];
        var trainers = [];
        var sortedTrainers = null;
        for(var i=0;i<foundCategory.length;i++){
            titles.push(foundCategory[i].title);
        }

        Trainer.find({}).populate('reviews').exec( (err, foundTrainer) => {
            if(err) {
                console.log(err)
            } else {
                sortedTrainers = trainerSort(foundTrainer);
            }
        });

        setTimeout(() => {
            if(sortedTrainers){
                // console.log(sortedTrainers)
                sortedTrainers.forEach(trainer =>{
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
        }, 1000);
               
    });
}
});

route.post('/newSession', (req, res) => {
    var details = JSON.parse(req.query.body);
    if (req.body.STATUS === "TXN_SUCCESS") {
        User.findById(req.query.id, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            req.login(user, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(user);
                    Trainer.findById(details.trainerId, (err, trainer) => {
                        if(err) {
                            console.log(err);
                        } else {
                            
                            // if(req.body.type == 'personal') { 
                            //     var flag = false;
                            //     var info = {
                            //         id: trainer._id,
                            //         category: req.body.category,           // subcategory
                            //         name: req.body.username,               // username of trainer
                            //         type: req.body.type,                   // personal or group
                            //         numOfSessions: req.body.numOfSessions, // number of sessions
                            //     }
                            //     user.trainers.forEach((trainer) => {
                            //         if(!(trainer.type == 'personal' && trainer.name == req.body.username)) {
                            //             console.log('I CAN BE BOUGHT FROM PERSONAL');
                            //             flag = true;
                            //             // personal trainer not already present on dashboard as personal
                                        
                            //             // user.trainers.push(info);
                                        
                            //             // const obj = new Object();
                            //             // obj[trainer.username] = new Array();
                            //             // user.markModified('trainers');
                            //             // user.bookedSlot = JSON.parse(req.body.booked);
                            //             // user.markModified('bookedSlot');
                            //             // user.save();
                            //         }
                            //         flag = false;
                            //     })
                            // }
        
                            // else if(req.body.type == 'group') {
                            //     var info = {
                            //         id: trainer._id,
                            //         category: req.body.category,           // subcategory
                            //         name: req.body.username,               // username of trainer
                            //         type: req.body.type,                   // personal or group
                            //         numOfSessions: req.body.numOfSessions, // number of sessions
                            //     }
                            //     user.trainers.forEach((trainer) => {
                            //         if(trainer.type == 'group' && req.body.type == 'group' && trainer.name == req.body.username) {
                            //             // group trainer not already present as group
                            //             console.log('I CAN BE BOUGHT FROM GROUP')
                                        
                            //             // user.trainers.push(info);
                                        
                            //             // const obj = new Object();
                            //             // obj[trainer.username] = new Array();
                
                                        
                            //             // user.markModified('trainers');
                                        
                            //             // user.save();
                            //         } 
                            //     })
                            // }
        
                            // res.redirect('/user/userDashboard/' + user._id);
        
                            console.log(req.body);

                            if(!(user.trainers.some(el => el.id == trainer._id))) {

                                var txnD = req.body.TXNDATE.slice(0,11);
                                var trsD = new Date(txnD);

                                if(details.numOfSessions == 5){
                                    trsD.setDate(trsD.getDate()+30);
                                }else if(details.numOfSessions == 10){
                                    trsD.setDate(trsD.getDate()+90);
                                }

                                var info = {
                                    id: trainer._id,
                                    category: details.category,
                                    name: details.username,
                                    type: details.type,
                                    numOfSessions:  parseInt(details.numOfSessions)-1,
                                    txndate: trsD,
                                }
                                user.trainers.push(info);

                                var info2 = {
                                    userName: user.username,
                                    category: details.category,
                                    type: details.type,
                                    numOfSessions: details.numOfSessions,
                                    payment_info:{
                                        TransactionID: req.body.TXNID,
                                        TransactionAmount: req.body.TXNAMOUNT,
                                        TransactionDate: req.body.TXNDATE,
                                        OrderId: req.body.ORDERID,
                                        BankName:req.body.BANKNAME,
                                        BankTransactionID: req.body.BANKTXNID,
                                    }
                                }

                                trainer.users.push(info2);
                                trainer.markModified('users');

                                // const obj = new Object();
                                // obj[trainer.username] = new Array();

                                user.bookedSlot = JSON.parse(details.booked);

                                details.userCount = JSON.parse(details.userCount);


                                if(details.type == "group"){
                                    var trainerSlots = trainer.calendar[Object.keys(details.userCount[trainer._id])[0].split('-').join(' ')];
                                    for(var i=0;i<trainerSlots.length;i++){
                                        var timeStr=trainerSlots[i].slice(0,11);
                                        timeStr = timeStr.split(' ')[0]+'-'+timeStr.split(' ')[2];

                                        if(details.userCount[trainer._id][Object.keys(details.userCount[trainer._id])[0].split('-').join(' ')] == timeStr){
                                            var ref = trainer.calendar[Object.keys(details.userCount[trainer._id])[0].split('-').join(' ')][i];
                                            var output = ref.substring(0,ref.length-1) + (parseInt(ref.slice('-1'))+1);
                                            trainer.calendar[Object.keys(details.userCount[trainer._id])[0].split('-').join(' ')][i] = output;
                                        }
                                    }
                                    trainer.markModified('calendar');
                                }else{

                                    var trainerKey = Object.keys(details.userCount[trainer._id])[0].split('-').join(' ');
                                    console.log(trainerKey);
                                    for(var i=0;i<trainer.personalSlots[trainerKey].length;i++){
                                        console.log(trainer.personalSlots[trainerKey][i]);
                                        var timeStr=trainer.personalSlots[trainerKey][i].slice(0,9);    
                                        if(timeStr == details.userCount[trainer._id][trainerKey]){
                                            var ref = trainer.personalSlots[trainerKey][i];
                                            var output = ref.substring(0,ref.length-1) + details.category + " "+(parseInt(ref.slice('-1'))+1);
                                            trainer.personalSlots[trainerKey][i] = output;
                                        }
                                    }

                                    trainer.markModified('personalSlots');
                                }

                                trainer.save();

                                // user.bookedSlot = obj;
                                user.markModified('trainers');
                                user.markModified('bookedSlot');
                                user.save();
                                setTimeout(()=>{
                                    res.redirect('/user/userDashboard/' + user._id);
                                },1000);
                            } else {
                                res.redirect('/user/userDashboard/' + user._id);
                            }
                        }
                    });
                }
            })
        }
    });
    }else{
        res.redirect('/user');
    }
});

route.get('/userDashboard/:id', middleware.isUserLoggedIn, (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('userDashboard', {user: user});
        }
    })
});

route.put('/updateuser/', (req, res) => {
    trainerID = Object.keys(req.body.userCount)[0];
    Trainer.findById(trainerID,(err,trainer)=>{
        if(err){
            console.log(err);
        }
        else{
            if(req.body.trainerType == "group"){
                var trainerSlots = trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]];
                for(var i=0;i<trainerSlots.length;i++){
                    var timeStr=trainerSlots[i].slice(0,11);
                    timeStr = timeStr.split(' ')[0]+'-'+timeStr.split(' ')[2];
                    
                    if(req.body.userCount[trainerID][Object.keys(req.body.userCount[trainerID])[0]] == timeStr){
                        var ref = trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]][i];
                        var output = ref.substring(0,ref.length-1) + (parseInt(ref.slice('-1'))+1);
                        trainer.calendar[Object.keys(req.body.userCount[trainerID])[0]][i] = output;
                    }
                }
                trainer.markModified('calendar');
            }else{
                var trainerKey = Object.keys(req.body.userCount[trainerID])[0];
                for(var i=0;i<trainer.personalSlots[trainerKey].length;i++){
                    var timeStr=trainer.personalSlots[trainerKey][i].slice(0,9);    
                    if(timeStr == req.body.userCount[trainerID][trainerKey]){
                        var ref = trainer.personalSlots[trainerKey][i];
                        var output = ref.substring(0,ref.length-1) + req.body.trainerCat + " "+(parseInt(ref.slice('-1'))+1);
                        trainer.personalSlots[trainerKey][i] = output;
                    }
                }
                trainer.markModified('personalSlots');
            }
            trainer.save();
        }
    });
    User.findById(req.user._id,(err,user)=>{
        if(err) {
            console.log(err);
        } else {
            user.bookedSlot = req.body.booked2;
            user.trainers.forEach(trainer =>{
                console.log(trainer);
                if(trainer.id == trainerID){
                    trainer.numOfSessions -= 1;
                }
            });

            user.markModified('bookedSlot')
            user.markModified('trainers')
            user.save()
            res.sendStatus(200);
        }
    })
});

route.get('/getTimeTable/:id', (req, res) => {
    Trainer.findById(req.params.id, (err, foundTrainer) => {
        if(req.query.trainerType == 'group'){
            res.json(foundTrainer.calendar);
        }else{
            res.json(foundTrainer.personalSlots);
        }
    })
});

route.get('/zoomDashboard/:id',(req, res)=>{
    res.render('userZoomDashboard',{trainer:req.params.id});
});


var meetConfig = {
    password:null,
    signature:null,
    meetingNumber:null,
    username:null
};


route.post('/signature/:username',(req,res)=>{
    var options = {
        method: 'GET',
        url: 'http://127.0.0.1:3500/trainer/passMeetingDetails/'+req.body.trainerId,
        // url: 'https://shapeyou-demo.herokuapp.com/trainer/passMeetingDetails/'+req.body.trainerId,
        headers: {
            'content-type': 'application/json'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        body = JSON.parse(body);
        
        function generateSignature(apiKey,apiSecret, meetingNumber, role) {
            
            // Prevent time sync issue between client signature generation and zoom 
            const timestamp = new Date().getTime() - 30000
            const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
            const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
            const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
            
            return signature
        }
        
        // // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
          signature = generateSignature(config.APIKey, config.APISecret,body.meetingNumber,0);
        
          body.signature = signature;
          body.username = req.params.username;
        
          res.json({body});
    });

});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = route;