var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var trainerSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    email: {
        type: String,
        unique: true
    },
    contact: Number,
    dob: {
        type:Date,
        default: null
    },
    profilePic: {
        type:String,
        default:null
    },
    about: {
        type:String,
        default:null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    user_id: String,
    subCategories: [
        {
            type: String,
            default: null
        }
    ],
    meetingDetails:{
        type: Object,
        default:null
    },
    calendar:{
        type: Object,
        default:null
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isCreated: {
        type: Boolean,
        default: false
    },
    personalSlots: {
        type: Object,
        default:null
    },
    coupon:{
        type:Object,
        default:null
    },
    categoryType: String,
    isZoomVerified:{
        type: Boolean,
        default: false
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

trainerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Trainer", trainerSchema);