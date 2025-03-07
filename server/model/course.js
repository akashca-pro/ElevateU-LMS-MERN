import mongoose from "mongoose";
import { nanoid } from "nanoid";

const lessonSchema = new mongoose.Schema({
    _id :{ type : String, default : ()=> nanoid(12) },
    title : { type :String, required : true },
    videoUrl : {type : String, required : true }, // cloudinary video url
    duration : {type : Number, default : 0},
    attachments : [{type : String}],

})

const moduleSchema = new mongoose.Schema({
    _id : { type :String, default : ()=> nanoid(12) },
    title : { type : String },
    lessons : [lessonSchema] // array of lessons inside the module

})

const reviewSchema = new mongoose.Schema({
    _id : { type : String, default : ()=> nanoid(12) },
    userId : { type : String, ref : 'User', required : true},
    rating : {type : Number, required : true , min : 1 , max : 5},
    comment : {type : String},

},{timestamps : true})

const courseSchema = new mongoose.Schema(
    {
      _id: { type: String, default: () => nanoid(12) },
      title: { type: String, required: true, trim: true },
      description: { type: String },
      category: { type: String, ref: "Category", default: null },
      tutor: { type: String, ref: "Tutor", required: true },
      price: { type: Number, required: true },
      isFree: { type: Boolean, default: false }, // Free or Paid Course
      discount: { type: Number, default: 0 }, // Discount percentage
      totalEnrollment: { type: Number, default: 0 },
      thumbnail: { type: String }, // Course Image
      requirements: [{ type: String }], // Array of requirements
      isPublished: { type: Boolean, default: false },
      status: { type: String, enum: ["pending", "approved", "rejected", "none"], default: "none" },
      reason: { type: String },
      rating: { type: Number, default: 0 }, // Overall Rating
      duration: { type: Number, default: 0 }, // Total course duration in minutes
      level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
      modules: [moduleSchema], // Array of modules containing lessons
      reviews: [reviewSchema], // Array of reviews
    },
    { timestamps: true }
  );

const Course = mongoose.model('Course',courseSchema)

export default Course