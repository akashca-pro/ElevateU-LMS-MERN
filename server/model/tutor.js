import mongoose from "mongoose";
import {nanoid} from 'nanoid'

const tutorSchema = mongoose.Schema({
    _id : {
        type : String,
        default : ()=>nanoid(12)
    },
    email : {
        type : String,
        required : true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password : {
        type : String,
        required : true,
    },
    firstName : {
        type: String,
        required: true,
        trim: true,
    },
    lastName : {
        type: String,
        trim: true,
    },
    phone : {
        type : String
    },
    googleID : {
        type : String  
    },
    profileImage : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
        trim : true
    },
    socialLinks :{
        type : [String] 
    },
    expertise: {
        type: [String], // Example: ["Web Development", "Machine Learning"]
    },
    experience: {
        type: Number, 
    },
    earnings: {
        type: Number,
        default: 0,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    adminVerified : {
        type : Boolean,
        default : false
    },
    tempMail :{
        type : String,
        expires : 600
    },
    otp : {
        type : String
    },
    otpExpires :{
        type : Date
    },
    isBlocked : {
        type : Boolean,
    }
},{timestamps : true});

const Tutor = mongoose.model("Tutor",tutorSchema);

export default Tutor