import mongoose  from "mongoose";
import {nanoid} from 'nanoid'

const userSchema  = new mongoose.Schema({
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
    googleID : {
        type : String  
    },
    profileImage : {
        type : String,
        default : ""
    },
    phone : {
        type : String,
    },
    dob : {
        type : String,
        default : ''
    },
    enrolledCourses : {
        type : [String],
    },
    bio : {
        type : String,
        trim : true,
    },
    socialLinks : {
        type : [String], // example ['http://instagram....','http://facebook...']
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isActive : {
        type : Boolean,
        default : false
    },
    tempMail :{
        type : String,
        expires : 600
    },
    isBlocked : {
        type : Boolean,
        default : false
    }
},{timestamps : true});

const User = mongoose.model("User",userSchema);

export default User