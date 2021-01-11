var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var trainerSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    email: String,
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
    contact: {
        type:Number,
        default:null
    },
    alternateContact: {
        type:Number,
        default:null
    },
    address: {
        type:String,
        default:null
    },
    amount: {
        type:Number,
        default:null
    },
    experiencePlace: {
        type:String,
        default:null
    },
    experienceYears: {
        type:Number,
        default:null
    },
    certification: {
        type:String,
        default:null
    },
    education: {
        type:String,
        default:null
    },
    socialHandle: {
        type:String,
        default:null
    },
    website: {
        type:String,
        default:null
    },
    aadhar: {
        type:String,
        default:null
    },
    resume: {
        type:String,
        default:null
    },
    referral: {
        type:String,
        default:null
    },
    payment: {
        type:Array,
        default:[]
    },
    timings: {
        type:Object,
        default:{}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeclined: {
        type: Boolean,
        default: false
    },
    formFilled: {
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
    meetingLogs:[
        {
            type:Object,
            default:null
        }
    ],
    calendar:{
        type: Object,
        default:null
    },
    users: [
        {
            type: Object,
            default: {}
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
    ],
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report"
        }
    ],
    pricePlan: String,
    avgRating : Number,
    // {
    //         // type: mongoose.Schema.Types.ObjectId,
    //         type:String,
    //         // ref: "Price"
    // }
});

trainerSchema.plugin(passportLocalMongoose, {usernameField: 'email',  errorMessages: {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError: 'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    IncorrectPasswordError: 'Password  is incorrect',
    IncorrectUsernameError: 'Username is incorrect',
    MissingUsernameError: 'No username was given',
    UserExistsError: 'A trainer with the given email is already registered'
}});

module.exports = mongoose.model("Trainer", trainerSchema);