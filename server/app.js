const express = require('express')
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Mongoose setup
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/shapeYou", {useNewUrlParser: true});

// Including model in app
const Trainer = require('../models/trainer');

// view engine
app.set("view engine", "ejs");

// PASSPORT Config
app.use(require("express-session")({
	secret: "Once again rusty wins cutest dogs",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send("HELLO");
});

app.listen(3000, function() {
    console.log("Server listening on port 3000");
})