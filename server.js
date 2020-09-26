const express = require('express');

const app = express();

const { MONGOURI } = require('./config/credentials');

const mongoose = require('mongoose');

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true 
});

mongoose.connection.on('connected',()=>{
    console.log('Connected to Mongoose.');
});

mongoose.connection.on('error',(err)=>{
    console.log(err);
});

mongoose.set('useFindAndModify', false);

const Trainer = require('./models/trainer');

// Requiring routes
const trainerRouter = require('./routes/trainer').route;

// PASSPORT CONFIG
const passport = require('passport');
const LocalStrategy  = require("passport-local");


app.use(require("express-session")({
	secret: "This is the secret cryptic message",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(Trainer.authenticate()));
// passport.serializeUser(Trainer.serializeUser());
// passport.deserializeUser(Trainer.deserializeUser());


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/trainer',trainerRouter);

const PORT = 3500;
app.listen(PORT,()=>console.log("Server Up and Running on http://127.0.0.1:"+PORT));

