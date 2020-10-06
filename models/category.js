const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    title: String,
    parent: String,
    trainers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer"
        }
    ],
});

module.exports = mongoose.model("Category", categorySchema);