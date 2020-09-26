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
    startDate: Date,
    endDate: Date,
    user_id: String,
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Trainer", trainerSchema);