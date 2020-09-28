const express = require('express');
const mongoose = require('mongoose');
const Trainer = require('../models/trainer');

const route = express.Router();


route.get('/details',(req,res)=>{
    res.render('details');
});

route.put('/submitDetails',(req,res)=>{
    Trainer.findByIdAndUpdate(req.user._id,{
        $push: {
                dob:req.body.dob,
                profilePic:req.body.image,
                about:req.body.about
               }
    },{
        new: true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error: err});
        }
        res.json(result);
    });
});

module.exports = route;