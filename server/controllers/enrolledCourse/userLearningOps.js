import Course from "../../model/course.js";
import EnrolledCourse from "../../model/enrolledCourses.js";
import ProgressTracker from "../../model/progressTracker.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js"


export const courseDetails = async (req,res) => {
    
    try {
        const userId = req.user.id;
        const courseId = req.params.id;

        const isEnrolled = await EnrolledCourse.findOne({ userId, courseId });

        if(!isEnrolled)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const courseDetails = await Course.findById(courseId)
        .populate('tutor','firstName lastName profileImage bio expertise experience socialLinks')

        if(!courseDetails)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

        const allAttachments = courseDetails.modules.flatMap((module)=>{
           return module.lessons.flatMap((lesson)=>{
            return lesson.attachments
           })
        })

        
        const moduleDetails = courseDetails.modules.map((module) => {
            
            const totalLessons = module.lessons.length;

            return {
                _id: module._id,
                title: module.title,
                totalLessons,
                lessonDetails: module.lessons.map((lesson) => ({
                    _id : lesson._id,
                    title: lesson.title,
                    duration: lesson.duration
                }))
            };
        });

        const totalLessons = moduleDetails.reduce((total,module)=>{
            return total + module.totalLessons
        },0)

        const responseData = {
            courseDetails : {
                _id : courseDetails._id,
                title : courseDetails.title,
                description : courseDetails.description,
                tutor : courseDetails.tutor,
                attachments : allAttachments,
                totalModules : courseDetails.modules.length || 0,
                totalLessons 
            },
            moduleDetails,
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.SUCCESS,HttpStatus.OK,responseData)

    } catch (error) {
        console.log(STRING_CONSTANTS.COURSE_DETAILS_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const progressStatus = async (req,res) => {
    
    try {
        const userId = req.user.id;
        const courseId = req.params.id;

        const progressTracker = await ProgressTracker.findOne({ userId, courseId })

        const course = await Course.findById(courseId)

        if(!progressTracker)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

        let totalLessons;
        let completedLessons;

        const currentModuleStatus = () => {
            const currentModule = progressTracker.modules.find(module => !module.isCompleted);
        
            if (!currentModule) return { currentModule: null, currentLesson: null, moduleProgress: 100 };

            totalLessons = currentModule.lessons.length;
            const completedLessonsLength = currentModule.lessons.filter(lesson=>lesson.isCompleted).length

            const moduleProgress = totalLessons > 0 ? Math.round((completedLessonsLength / totalLessons) * 100) : 0;
        
            const currentLesson = currentModule.lessons.find(lesson => !lesson.isCompleted);
        
            return {
                currentModule: currentModule.moduleId,
                currentLesson: currentLesson.lessonId,
                moduleProgress
            };
        };

        const { currentModule, currentLesson, moduleProgress } = currentModuleStatus();

        const totalModules = progressTracker.modules.length;
        const completedModules = progressTracker.modules.map(m=>{
            if(m.isCompleted){
                return m.moduleId
            }
        })
        // const completedModules = progressTracker.modules.filter(module=>module.isCompleted).length;

        const courseProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        const moduleIndex = progressTracker.modules.findIndex(m=>m.moduleId === currentModule)
        const lessonIndex = progressTracker.modules[moduleIndex].lessons.findIndex(l=>l.lessonId === currentLesson)

        let upcomingModule = null;

        if (moduleIndex !== -1 && moduleIndex + 1 < progressTracker.modules.length) {
            upcomingModule = progressTracker.modules[moduleIndex + 1].moduleId;
        }

        const currentProgress = {
            currentModule : {
                _id : currentModule,
                title : course.modules[moduleIndex].title
            },
            upcomingModule : {
                _id : upcomingModule,
                title : course.modules.length > moduleIndex + 1 ? course.modules[moduleIndex + 1] : null
            },
            currentLesson : {
                _id : currentLesson,
                title : course.modules[moduleIndex].lessons[lessonIndex].title
            },
            moduleProgress,
            courseProgress,
            currentLevel : progressTracker.level.currentLevel,
            levelSize : progressTracker.level.levelSize,
            totalLessons,
            completedLessons,
            completedModules
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.PROGRESS_STATUS_SUCCESS, HttpStatus.OK,currentProgress);

    } catch (error) {
        console.log(STRING_CONSTANTS.PROGRESS_STATUS_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

export const changeLessonOrModuleStatus = async (req,res) => {
    
    try {
        const userId = req.user.id;

        const { lessonId, moduleId, courseId } = req.body
        
        const progressTracker = await ProgressTracker.findOne({ userId, courseId });

        if(!progressTracker || !lessonId)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const updatedProgress = await ProgressTracker.findOneAndUpdate(
            { userId, courseId, "modules.moduleId": moduleId, "modules.lessons.lessonId": lessonId },
            { $set: { "modules.$.lessons.$[les].isCompleted": true } }, 
            {
                arrayFilters: [
                    { "les.lessonId": lessonId } 
                ],
                new: true
            }
        );

        if(!updatedProgress)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const moduleIndex = updatedProgress.modules.findIndex((m)=>m.moduleId === moduleId)

        if(moduleIndex !== -1){
            const module = updatedProgress.modules[moduleIndex];
            const allLessonsCompleted = module.lessons.every(lesson=> lesson.isCompleted)

            if(allLessonsCompleted){
                updatedProgress.modules[moduleIndex].isCompleted = true;
                await updatedProgress.save()
            }
        }

        const completedModules = progressTracker.modules.filter(m=>m.isCompleted).length
        const totalModules = progressTracker.modules.length

        const getCurrentLevel = (completedModules, totalModules) => {
            if (totalModules === 0) return 1; // Prevent division by zero
        
            const modulesPerLevel = Math.ceil(totalModules / 5); // Split modules into 5 levels
            let level = Math.floor(completedModules / modulesPerLevel) + 1; // Ensure next level only if completed full modules
        
            return Math.min(level, 5); // Cap at level 5
        };
        
        updatedProgress.level.currentLevel = getCurrentLevel(completedModules, totalModules)

        await updatedProgress.save()

        return ResponseHandler.success(res, STRING_CONSTANTS.PROGRESS_CHANGE_LESSON_STATUS_SUCCESS, HttpStatus.OK,updatedProgress)

    } catch (error) {
        console.log(STRING_CONSTANTS.PROGRESS_CHANGE_LESSON_STATUS_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

export const loadCurrentLesson = async (req,res) => {
    
    try {
        const {userId} = req.query;
        const {courseId, lessonId, moduleId} = req.query

        if(!courseId || !lessonId || !moduleId)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const isEnrolled = await EnrolledCourse.findOne({ courseId, userId })

        if(!isEnrolled)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);
        
        const lessonData = await Course.aggregate([
            { $match : { _id : courseId } },
            { $unwind : '$modules' },
            { $match  : { 'modules._id' : moduleId } },
            { $unwind : '$modules.lessons' },
            { $match : { 'modules.lessons._id' : lessonId } },
            { $project : { _id : 0, lesson : '$modules.lessons' } }
        ]);

        if(!lessonData || lessonData.length === 0 )
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT)

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_CURRENT_LESSON_SUCCESS, HttpStatus.OK,lessonData)        

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_CURRENT_LESSON_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}