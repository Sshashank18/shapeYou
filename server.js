const express = require('express');
const cors = require('cors');
const ejs = require('ejs');

const app = express();

const methodOverride = require("method-override");


//MONGOOSE
const { MONGOURI } = require('./config/credentials');

const PORT = process.env.PORT || 3500;

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

app.set("view engine", 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

const Trainer = require('./models/trainer');
const User = require('./models/user');

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
passport.use('trainer-local', new LocalStrategy(Trainer.authenticate()));
passport.use('user-local', new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) { 
	done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
	if(user!=null)
		done(null,user);
});

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


//Decrypting

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//API Handling
const trainerRouter = require('./routes/trainer');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');


app.use('/auth', authRouter);
app.use('/trainer',trainerRouter);
app.use('/user',userRouter);

app.get('/',(req,res)=>{
	res.redirect('/user');
});

//Port Listening
app.listen(PORT,()=>console.log("Server Up and Running on http://127.0.0.1:"+PORT));
