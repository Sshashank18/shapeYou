const mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    // thumbnail: {image}
    start: {
        type: Date,
        required: 'Must have a start date'
    },
    end: {
        type: Date,
        required: 'Must have end date'
    },
    // slots: [
    //     {
    //         type: Date,
    //     }
    // ]
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer"
        },
        username: String
    }
});

module.exports = mongoose.model("Course", courseSchema);