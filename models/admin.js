var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var adminSchema = new mongoose.Schema({
    email: String,
    type: String,
    password: String
});

adminSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model("Admin", adminSchema);
