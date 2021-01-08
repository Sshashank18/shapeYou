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

userSchema.plugin(passportLocalMongoose, {usernameField: 'email',  errorMessages: {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError: 'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    IncorrectPasswordError: 'Password  is incorrect',
    IncorrectUsernameError: 'Username is incorrect',
    MissingUsernameError: 'No username was given',
    UserExistsError: 'A user with the given username is already registered'
}});

module.exports = mongoose.model("User", userSchema);
