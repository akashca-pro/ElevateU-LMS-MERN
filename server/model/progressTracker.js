import mongoose from "mongoose";
import { nanoid } from "nanoid";

const progressTrackerSchema = new mongoose.Schema({
    
    _id : { type : String, default : ()=> nanoid(12) },

    userId : { type : String, ref : 'User', required : true},

    courseId : { type : String, ref : 'Course', required : true },

    modules : [{
        _id : false,
        moduleId : { type : String ,ref : 'Course.modules'},
        lessonsCompleted : [{ type : String, ref : 'Course.modules.lessons' }],
        isCompleted : { type : Boolean, default : false }
    }],

    courseProgressPercentage : { type : Number, enum : [0,25,50,75,100] , default : 0 },

    level : {
        currentLevel : { type : Number , enum : [1,2,3,4,5] , default : 1},
        levelSize : { type : Number, required : true },
    }

},{timestamps : true})


const ProgressTracker = mongoose.model('ProgressTracker',progressTrackerSchema);

export default ProgressTracker