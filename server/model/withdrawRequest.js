import mongoose from "mongoose";
import { nanoid } from "nanoid";

const withdrawalRequestSchema = new mongoose.Schema({

    _id : { type : String, default : ()=>nanoid(12) },
    userId : { type : String, refPath : 'userRole', required : true },
    userModel : { type : String, enum : ['User','Tutor'], required : true },
    amount : { type : Number, required : true },
    bankDetails : {
        acntNo : { type : String, required : true },
        ifsc : { type : String, required : true },
        bankName : { type : String, required : true },
        holderName : { type : String, required : true }
    },
    status : { type : String, enum : ['pending','processing','completed','rejected'], default : 'pending' },
    adminNote : { type : String }
},{timestamps : true})

const WithdrawalRequest = mongoose.model('WithdrawalRequest',withdrawalRequestSchema)

export default WithdrawalRequest