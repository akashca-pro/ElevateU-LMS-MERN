import mongoose from "mongoose";
import { nanoid } from "nanoid";

const enrollmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => nanoid(12),
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    course: {
        type: String,
        ref: "Course",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    progress: {
        type: Number,
        default: 0, // Progress in percentage (0-100)
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const EnrolledCourse = mongoose.model("EnrolledCourse", enrollmentSchema);
export default EnrolledCourse;
