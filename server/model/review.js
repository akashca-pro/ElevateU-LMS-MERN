import mongoose from "mongoose";
import { nanoid } from "nanoid";

const reviewSchema = new mongoose.Schema({
    _id : { type : String, default : ()=> nanoid(12) },
    userId : { type : String, ref : 'User', required : true},
    rating : {type : Number, required : true , min : 1 , max : 5},
    comment : {type : String},

},{timestamps : true})

const Review = mongoose.model('Review',reviewSchema)

export default Review