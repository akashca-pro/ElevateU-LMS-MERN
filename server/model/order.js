import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderSchema = new mongoose.Schema({
    _id : { type : String, default : ()=> nanoid(12) },

    userId : { type : String, ref : 'User', required : true},
    
    userData : {
        name : { type : String, required : true },
        email : { type : String , required : true, unique : true },
        phone : { type : Number, required : true }
    },

    courseId : { type : String, ref : 'Course', required : true },

    paymentStatus : { type : String, enum : ['pending','success','failed','cancelled'] , default : 'pending'},

    price : { 
        originalPrice : { type : Number, required : true },
        courseDiscount :  { type : Number },
        couponCode : { type : String },
        discountType : { type : String },
        couponDiscount : { type : Number },
        finalPrice : { type : Number, required : true }
     },

     paymentDetails : {
        transactionId : { type : String, unique : true },
        orderId : { type : String , required : true }
     },

}, { timestamps : true });

const Order = mongoose.model('Order',orderSchema);

export default Order