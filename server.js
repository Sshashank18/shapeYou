const express = require('express');

const app = express();


//MONGOOSE
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
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const Trainer = require('./models/trainer');

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
passport.use(new LocalStrategy(Trainer.authenticate()));
passport.serializeUser(Trainer.serializeUser());
passport.deserializeUser(Trainer.deserializeUser());

require('./models/trainer');


//Decrypting

app.use(express.json());
app.use(express.urlencoded({extended:true}));


//API Handling
// const trainerRouter = require('./routes/trainer')
const authRouter = require('./routes/auth');

// app.use('/trainer',trainerRouter);
app.use('/auth', authRouter);



//Port Listening
const PORT = 3500;
app.listen(PORT,()=>console.log("Server Up and Running on http://127.0.0.1:"+PORT));

