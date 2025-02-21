import mongoose from "mongoose";
import { nanoid } from "nanoid";


const verificationRequestSchema = new mongoose.Schema({
    _id : {
        type : String,
        default : ()=>nanoid(12)
    },
    tutorID : {
        type : String,
        required : true,
        ref : 'Tutor'
    },
    name : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['pending','approved','rejected'],
        default : 'pending'
    },
    reason : {
        type : String,
    }
},{timestamps : true})

const VerificationRequest = mongoose.model('VerificationRequest', verificationRequestSchema);

export default VerificationRequest