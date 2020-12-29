const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const cron = require('node-cron');

const app = express();

const methodOverride = require("method-override");
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');


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

// let gfs;

// mongoose.connection.on('open',()=>{
//  gfs = Grid(mongoose.connection.db,mongoose.mongo);
//  gfs.collection('uploads');
// });


app.set("view engine", 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

const Trainer = require('./models/trainer');
const User = require('./models/user');
const Admin = require('./models/admin');

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
passport.use('admin', new LocalStrategy(Admin.authenticate()));
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


//API Handling
const authRouter = require('./routes/auth');
const trainerRouter = require('./routes/trainer');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use('/auth', authRouter);
app.use('/trainer',trainerRouter);
app.use('/user',userRouter);
app.use('/admin', adminRouter);

app.get('/',(req,res)=>{
	res.redirect('/user');
});

app.get('/zoomDashboard',(req,res)=>{
	res.render('zoomDashboard');
});

cron.schedule('0 1 * * SUN', function() {
	// cron.schedule("*/10 * * * * *", function() {
	console.log('Data Reset');

	Trainer.updateMany({$set:{calendar:null,personalSlots:null}},(err,result)=>{
        if(err) console.log(err);
        else console.log('Calendar has been resetted.');
	});

	console.log('numOfSessions with 0 value removed')
	User.find({},(err,result)=>{
		result.forEach(user => {
			tempTrainers = [];
			if(user.trainers.length!=0){
				// tempTrainers = user.trainers;
				user.trainers.forEach((trainer,i)=>{
					if(trainer.numOfSessions > 0){
						tempTrainers.push(trainer)
					}
				});
			}
			user.trainers = tempTrainers;
			user.bookedSlot = null;
			user.save();
		});
	});
});

var tempTrainers;

cron.schedule('0 0 * * *',()=>{
	var currDate = new Date();
	currDate.setHours(0, 0, 0, 0);
	User.find({},(err,result)=>{
		result.forEach(user => {
			if(user.trainers.length!=0){
				tempTrainers = user.trainers;
				user.trainers.forEach((i,value)=>{
					if(i.txndate){
						i.txndate.setHours(0,0,0,0);
						if(currDate.getTime() == i.txndate.getTime()){
							tempTrainers = [];
							for(var l=0;l<user.trainers.length;l++){
								if(l!=value){
									tempTrainers.push(user.trainers[l]);
								}
							}
	
						}
					}
				});
				user.trainers = tempTrainers;
				user.save();
			}
		});
	});
});

//Port Listening
app.listen(PORT,()=>console.log("Server Up and Running on http://127.0.0.1:"+PORT));

// route.post('/admin', passport.authenticate('admin-local',
//     {
//         successRedirect: '/admin',
//         failureRedirect: '/user'
//     }
// ), (req, res) => {

//     // var newAdmin = new Admin({
//     //     email: req.body.email,
//     //     type: "Admin"
//     // });
//     // Admin.register(newAdmin, req.body.password, (err, admin) => {
//     //     if(err){
//     //         console.log(err); 
//     //     } else {
//     //         console.log(admin);
//     //     }
//     // })  
//     Admin.findOne({email: req.body.email}, (err, admin) => {
//         console.log(admin);
//     })     
//     console.log(req.user);
// });