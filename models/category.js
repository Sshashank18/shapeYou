const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    title :String,
    parent :String,
    image: String
});

module.exports = mongoose.model("Category" , categorySchema);
