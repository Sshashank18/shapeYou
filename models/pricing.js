var mongoose = require('mongoose');

var priceSchema = new mongoose.Schema({
    title: String,
    trialnumOfSessions: Number,
    trialPackPrice: Number,
    trialBasicSegment: Number,
    trialPerSessionAmount: Number,
    goldnumOfSessions: Number,
    goldPackPrice: Number,
    goldBasicSegment: Number,
    goldPerSessionAmount: Number,
    platinumnumOfSessions: Number,
    platinumPackPrice: Number,
    platinumBasicSegment: Number,
    platinumPerSessionAmount: Number,
});

module.exports = mongoose.model("Price", priceSchema);