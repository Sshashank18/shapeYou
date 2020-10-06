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
    dob: {
        type:String,
        default: null
    },
    profilePic: {
        type:String,
        default:null
    },
    about: {
        type:String,
        default:null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    user_id: String,
    subCategories: [
        {
            type: String
        }
    ]
});

trainerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Trainer", trainerSchema);