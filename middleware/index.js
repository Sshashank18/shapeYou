const User = require('../models/user');
const Trainer = require('../models/trainer');
var Category = require('../models/category');
var middlewareObj = {};

middlewareObj.isUserLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        if(req.user.type == 'User' || req.user.type == 'Admin') {
			console.log("This is a user");
		    next();
        } else {
			console.log("A trainer tried a user route!");
			res.redirect("/trainer");
		}
	} else {
		req.flash("error", "You need to be logged in to do that!");
		// Not logged in ==>
		res.redirect("/auth/login");
	}
}

middlewareObj.isTrainerLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        if(req.user.type == 'Trainer') {
			console.log("This is a trainer");
		    next();
        } else {
			console.log('A user tried a trainer route!');
			res.redirect("/user");
		}
	} else {
		// Not logged in ==>
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/auth/login");
	}
}

middlewareObj.isAdminLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		if(req.user.type == 'Admin') {
			next();
		} else {
			res.redirect('/user');
		}
	} else {
		res.redirect('/auth/admin');
	}
}

module.exports = middlewareObj;