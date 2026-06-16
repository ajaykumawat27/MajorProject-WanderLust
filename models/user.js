const { required, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    //username and password are automatically defined by (passport-local-mongoose)
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type: String,
    }
},{timestamps : true});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);