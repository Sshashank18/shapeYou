const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    title :String,
    parent :String
});

module.exports = mongoose.model("Category" , categorySchema);
