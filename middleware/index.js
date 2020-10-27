const User = require('../models/user');
const Trainer = require('../models/trainer');
var Category = require('../models/category');
var middlewareObj = {};

middlewareObj.isUserLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        if(req.user.type == 'User') {
		    next();
        }
	}
	// req.flash("error", "You need to be logged in to do that!");
	res.redirect("/auth/login");
}

middlewareObj.isTrainerLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        if(req.user.type == 'Trainer') {
		    next();
        }
	}
	// req.flash("error", "You need to be logged in to do that!");
	res.redirect("/auth/login");
}

module.exports = middlewareObj;