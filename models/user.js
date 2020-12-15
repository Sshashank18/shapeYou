var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const category = require('./category');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    email: {
        type: String,
        unique: true
    },
    sessionCount: Number,
    trainers: [
        {
            type: Object,
            default: {}
        }
    ],
    bookedSlot: {
        type: Array,
        default: []
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model("User", userSchema);
