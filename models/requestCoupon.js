const mongoose = require('mongoose');

var requestSchema = new mongoose.Schema({
        id: String,
        username: String,
        coupon: {
            type:Object,
            default:null
        }
});

module.exports = mongoose.model('Request', requestSchema);