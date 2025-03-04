import mongoose from "mongoose";
import { nanoid } from "nanoid";

const courseSchema = mongoose.Schema({
    _id : {
        type : String,
        default : ()=>nanoid(12)
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String
    },
    category : {
        type : String,
        ref : 'Category',
        default : null
    },
    tutor : {
        type : String,
        ref : 'Tutor',
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    totalEnrollment : {
        type : Number
    },
    thumbnail : {
        type : String,
    },
    requirements : {
        type : String,
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    status :  {
        type : String,
        enum : ['pending','approved','rejected','none'],
        default : 'none'
    },
    reason : {
        type : String
    },
    rating : {
        type : Number,
    } 
})

const Course = mongoose.model('Course',courseSchema)

export default Course