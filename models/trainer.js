var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var trainerSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    contact: Number,
    dob: String,
    profilePic: String,
    about: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    user_id: String,
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
});

trainerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Trainer", trainerSchema);