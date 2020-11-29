const User = require('../models/user');
const Trainer = require('../models/trainer');
var Category = require('../models/category');
var middlewareObj = {};

middlewareObj.isUserLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        if(req.user.type == 'User') {
			console.log("This is a user");
		    next();
        } else {
			console.log("A trainer tried a user route!");
			res.redirect("/trainer");
		}
	} else {
		// req.flash("error", "You need to be logged in to do that!");
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
		res.redirect("/auth/login");
	}
	// req.flash("error", "You need to be logged in to do that!");
}

module.exports = middlewareObj;