var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    body: String,
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);