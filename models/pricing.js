var mongoose = require('mongoose');

var priceSchema = new mongoose.Schema({
    title: String,
    trialnumOfSessions: Number,
    trialPackPrice: Number,
    trialPackDiscount: Number,
    trialBasicSegment: Number,
    trialPerSessionAmount: Number,
    goldnumOfSessions: Number,
    goldPackPrice: Number,
    goldPackDiscount: Number,
    goldBasicSegment: Number,
    goldPerSessionAmount: Number,
    platinumnumOfSessions: Number,
    platinumPackPrice: Number,
    platinumPackDiscount: Number,
    platinumBasicSegment: Number,
    platinumPerSessionAmount: Number,
});

module.exports = mongoose.model("Price", priceSchema);