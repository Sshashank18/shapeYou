var express = require('express');
var route = express.Router();

var User = require('../models/user');
var Trainer = require('../models/trainer');
var Category = require('../models/category');

route.get('/', (req, res) => {
    Category.find({}, (err, foundCategory) => {
        if(err) {
            console.log(err);
        } else {
            res.render('userDashboard', {categories: foundCategory});
        }
    });
});

module.exports = route;