var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    author: {
        username: String, 
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    trainerName: String,
    trainerId: String,
    category: String,
    issue: String
});

module.exports = mongoose.model("Report", reportSchema);