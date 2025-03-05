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
        required : function () {
            return !this.googleID;}
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
    dob : {
        type : String,
        default : ''
    },
    socialLinks :{
        type : [String],
        default : [] 
    },
    expertise: {
        type: [String], // Example: ["Web Development", "Machine Learning"]
        default : []
    },
    experience: {
        type: String, 
        default : 0
    },
    earnings: {
        type: Number,
        default: 0,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isActive : {
        type : Boolean,
        default : false
    },
    isAdminVerified : {
        type : Boolean,
        default : false
    },
    tempMail :{
        type : String,
        expires : 600
    },
    status : {
        type : String,
        enum : ['pending','approved','rejected','none'],
        default : 'none'
    },
    reason : {
        type : String,
    },
    isBlocked : {
        type : Boolean,
    }
},{timestamps : true});

const Tutor = mongoose.model("Tutor",tutorSchema);

export default Tutor