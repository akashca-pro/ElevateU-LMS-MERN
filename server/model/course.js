import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Tutor from "./tutor.js";

const lessonSchema = new mongoose.Schema({
    _id :{ type : String, default : ()=> nanoid(12) },
    title : { type :String,  },
    videoUrl : {type : String, }, // cloudinary video url
    duration : {type : Number, default : 0},
    attachments : [{type : String}],

})

const moduleSchema = new mongoose.Schema({
    _id : { type :String, default : ()=> nanoid(12) },
    title : { type : String },
    lessons : [lessonSchema] // array of lessons inside the module

})


const courseSchema = new mongoose.Schema(
    {
      _id: { type: String, default: () => nanoid(12) },

      title: { type: String, required: function () { return !this.draft }},

      description: { type: String ,required: function () { return !this.draft }},

      category: { type: String, ref: "Category", default: null ,required: function () { return !this.draft }},

      tutor: { type: String, ref: "Tutor", required: function () { return !this.draft } },

      price: { type: Number, required: function () { return !this.draft } },

      isFree: { type: Boolean, default: false }, // Free or Paid Course

      discount: { type: Number, default: 0 }, // Discount percentage

      totalEnrollment: { type: Number, default: 0 },

      thumbnail: { type: String ,required: function () { return !this.draft }}, 

      requirements: [{ type: String }], // Array of requirements

      isPublished: { type: Boolean, default: false },

      status: { type: String, enum: ["pending", "approved", "rejected", "draft"], default: "draft" },

      reason: { type: String },

      rating: { type: Number, default: 0 }, // Overall Rating

      duration: { type: Number, default: 0 }, // Total course duration in minutes

      level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },

      modules: {type : [moduleSchema] },

      whatYouLearn : [{ type : String }],

      hasCertification : { type : Boolean , default : false},
      
      draft : { type : Boolean, default : false },
    },
    { timestamps: true }
  );

  courseSchema.pre("save", async function (next) {
    try {
      const tutorId = this.tutor;
  
      // Case 1: New draft course is created
      if (this.isNew && this.draft) {
        await Tutor.findByIdAndUpdate(tutorId, { $inc: { draftCount: 1 } });
      }
  
      // Case 2: Drafted course is published (draft: true -> false)
      else if (this.status === 'draft' && !this.draft) {
        await Tutor.findByIdAndUpdate(tutorId, { $inc: { draftCount: -1 } });
      }
  
      next();
    } catch (error) {
      next(error); 
    }
  });

  courseSchema.pre('findOneAndDelete', async function (next) {
    try {
        const query = this.getQuery(); 
        const course = await Course.findOne(query);

        if (course?.draft) {
            await Tutor.findByIdAndUpdate(course.tutor, { $inc: { draftCount: -1 } });
        }

        next();
    } catch (error) {
        next(error);
    }
});

  courseSchema.pre("validate", function (next) {
    try {
        // If the course is not a draft, ensure modules and lessons have required fields
        if (!this.draft) {
            if (!this.modules || this.modules.length === 0) {
                return next(new Error("At least one module is required when draft is false."));
            }

            for (const module of this.modules) {
                if (!module.title) {
                    return next(new Error("Module title is required when draft is false."));
                }

                if (!module.lessons || module.lessons.length === 0) {
                    return next(new Error("At least one lesson is required in each module when draft is false."));
                }

                for (const lesson of module.lessons) {
                    if (!lesson.title) {
                        return next(new Error("Lesson title is required when draft is false."));
                    }
                    if (!lesson.videoUrl) {
                        return next(new Error("Lesson videoUrl is required when draft is false."));
                    }
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});



const Course = mongoose.model('Course',courseSchema)

export default Course