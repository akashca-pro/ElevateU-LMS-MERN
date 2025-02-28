import mongoose from "mongoose";
import { nanoid } from "nanoid";

const adminSchema = mongoose.Schema({
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
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        trim : true,
        default : ''
    },
    profileImage : {
        type : String,
        default : ''
    }

},{timestamps : true});

const Admin = mongoose.model('Admin',adminSchema)

export default Admin