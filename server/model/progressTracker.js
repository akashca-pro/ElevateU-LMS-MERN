import mongoose from "mongoose";
import { nanoid } from "nanoid";

const progressTrackerSchema = new mongoose.Schema({
    
    _id : { type : String, default : ()=> nanoid(12) },

    userId : { type : String, ref : 'User', required : true},

    courseId : { type : String, ref : 'Course', required : true },

    modules : [{
        _id : false,
        moduleId : { type : String ,ref : 'Course.modules'},
        moduleTitle : { type : String },
        moduleProgress : { type : Number, default : 0 },
        lessons : [{ 
            _id : false,
            lessonTitle : { type : String },
            lessonId : {type : String, ref : 'Course.modules.lessons' },
            isCompleted : { type : Boolean, default : false }
        }],
        isCompleted : { type : Boolean, default : false }
    }],

    level : {
        currentLevel : { type : Number , enum : [1,2,3,4,5] , default : 1},
        levelSize : { type : Number, required : true },
    },

    lastCourseUpdate : { type : Date, default : null },

    resetCount : { type : Number, default : 0 }

},{timestamps : true})


progressTrackerSchema.pre("save", async function (next) {
    try {
        const course = await mongoose.model("Course").findById(this.courseId).select("modules updatedAt");

        if (!course) return next();

        // If the course has been updated after last update, check for new modules or lessons
        if (!this.lastCourseUpdate || this.lastCourseUpdate < course.updatedAt) {
            this.lastCourseUpdate = course.updatedAt;

            // Convert modules to a map for quick lookup
            const progressModulesMap = new Map(this.modules.map(m => [m.moduleId, m]));

            let courseProgressUpdated = false;

            // Iterate over course modules
            for (const courseModule of course.modules) {
                if (!progressModulesMap.has(courseModule._id)) {
                    //  New module found → Add to progress tracker
                    this.modules.push({
                        moduleId: courseModule._id,
                        moduleTitle: courseModule.moduleTitle,
                        moduleProgress: 0,
                        lessons: courseModule.lessons.map(lesson => ({
                            lessonId: lesson._id,
                            lessonTitle: lesson.lessonTitle,
                            isCompleted: false
                        })),
                        isCompleted: false
                    });

                    courseProgressUpdated = true;
                } else {
                    //  Check for new lessons inside existing modules
                    let progressModule = progressModulesMap.get(courseModule._id);
                    const progressLessonsMap = new Map(progressModule.lessons.map(l => [l.lessonId, l]));

                    for (const lesson of courseModule.lessons) {
                        if (!progressLessonsMap.has(lesson._id)) {
                            // New lesson found → Add to progress tracker
                            progressModule.lessons.push({
                                lessonId: lesson._id,
                                lessonTitle: lesson.lessonTitle,
                                isCompleted: false
                            });

                            progressModule.isCompleted = false; // Mark module as incomplete
                            courseProgressUpdated = true;
                        }
                    }
                }
            }

        }

        next();
    } catch (error) {
        next(error);
    }
});

const ProgressTracker = mongoose.model('ProgressTracker',progressTrackerSchema);

export default ProgressTracker