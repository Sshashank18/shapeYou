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
    category: String
});

mongoose.exports = mongoose.model("Report", reportSchema);