var mongoose = require('mongoose');

var trainerSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    contact: Number,
    dob: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    user_id: String,
});

module.exports = mongoose.model("Trainer", trainerSchema);