var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

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
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
