import mongoose from "mongoose";
import { nanoid } from "nanoid";

const enrollmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => nanoid(12),
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    paymentDetails : {
        transactionId : { type : String , required : function(){ return this.paymentDetails?.amountPaid > 0 } },
        amountPaid : { type : Number ,default : 0, required : true},
        orderId : { type : String, ref : 'Order' }
    },
    courseId : {
        type: String,
        ref: "Course",
        required: true,
    },
    progress: {
        type: Number,
        default: 0, // Progress in percentage (0-100),
        min : [0,'Progress cannot be less than 0'],
        max : [100,'Progress cannot be greater than 100']
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const EnrolledCourse = mongoose.model("EnrolledCourse", enrollmentSchema);
export default EnrolledCourse;
