var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const category = require('./category');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    sessionCount: Number,
    trainers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer"
        },
        {
            category: String
        }
    ],
    bookedSlot: {
        type: Array,
        default: []
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
