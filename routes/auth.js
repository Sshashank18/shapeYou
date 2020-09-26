const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Trainer = mongoose.model("Trainer");

router.post('/signup',(req,res)=>{
    const {username,password,email,contact,dob} = req.body;
    if(!username || !email || !password ||!contact){
        return res.status(422).json({error: "Please add all the fields"});
    }

    Trainer.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"Email Already Exists"});
        }
        bcrypt.hash(password, 10)
            .then(hashedPassword => {
                const trainer = new Trainer({
                    email,
                    password: hashedPassword,
                    username,
                    contact,
                    dob
                });
            trainer.save()
    })

});