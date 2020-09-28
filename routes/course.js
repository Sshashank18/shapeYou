const express = require('express');
const mongoose = require('mongoose');

const Course = require('../models/course');
const route = express.Router();

// route.get('/', (req, res) => {
//     Course.find({}, (err, allCourses) => {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('/index', {courses: allCourses});
//         }
//     });
// })

route.get('/newCourse', (req, res) => {
    res.render('course');
});

route.post('/newCourse', (req, res) => {
    Course.create(req.body.course, (err, course) => {
        if(err) {
            console.log(err);
        } else {
            // adding username and id of trainer to course
            course.creator.id = req.user._id;
            course.creator.username = req.user.username;
            course.save();
            res.redirect('/course/' + course._id);
        }
    });
});

// Show page
route.get('/:id', (req, res) => {
    Course.findById(req.params.id, (err, foundCourse) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {course: foundCourse});
        }
    });
});

route.delete('/:id', (req, res) => {
    Course.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
})

module.exports = route;