import Course from "../../model/course.js";
import EnrolledCourse from "../../model/enrolledCourses.js";
import ProgressTracker from "../../model/progressTracker.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js"

const calculateProgress = (modules) => {
    if (!modules || modules.length === 0) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    for (const module of modules) {
        for (const lesson of module.lessons) {
            totalLessons++;
            if (lesson.isCompleted) completedLessons++;
        }
    }

    return totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
};

// load course and module details

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

        const progressTracker = await ProgressTracker.findOne({ userId, courseId })

        if(!progressTracker)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const allAttachments = courseDetails.modules.flatMap((module,moduleIndex)=>{
           return module.lessons.flatMap((lesson,lessonIndex)=>{

            const attachments = lesson.attachments.flatMap(ats=>{
                return {
                    title : ats.title,
                    link : ats.link,
                    fileType : ats.link.split('.').pop()
                }
            })

            return {
                moduleId : moduleIndex + 1,
                lessonId : lessonIndex + 1,
                moduleTitle : module.title,
                lessonTitle : lesson.title,
                attachments
            }
           })
        })

        const flattenedData = allAttachments.flatMap(({ moduleId, lessonId, moduleTitle, lessonTitle, attachments }) =>
            attachments.map(({ title, link, fileType }) => ({
              moduleId,
              lessonId,
              moduleTitle,
              lessonTitle,
              title,
              link,
              fileType
            }))
          );
        
        const moduleDetails = courseDetails.modules.map((module) => {
            
            const totalLessons = module.lessons.length;
            const moduleInstance = progressTracker.modules.find(m=>m.moduleId === module._id)

            const completedLessons = moduleInstance.lessons.filter(les=>les.isCompleted).map(les=>les.lessonId)

            return {
                _id: module._id,
                title: module.title,
                totalLessons,
                lessonDetails: module.lessons.map((lesson) => ({
                    _id : lesson._id,
                    title: lesson.title,
                    duration: lesson.duration,
                    completedLessons
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
                attachments : flattenedData,
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

// load current progress Status

export const progressStatus = async (req,res) => {
    
    try {
        const userId = req.user.id;
        const courseId = req.params.id;

        const progressTracker = await ProgressTracker.findOne({ userId, courseId })

        if(!progressTracker)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

        let totalLessons;

        // const allModulesCompleted = progressTracker.modules.every(module => module.isCompleted);
        // if (allModulesCompleted) {
        // return ResponseHandler.success(res, STRING_CONSTANTS.COURSE_COMPLETED, HttpStatus.OK, {
        //     courseProgress: 100,
        // });
        // }

        const currentModuleStatus = () => {
            const currentModule = progressTracker.modules.find(module => !module.isCompleted);
        
            if (!currentModule) return {
                 currentModule: progressTracker.modules[0], 
                 currentLesson: progressTracker.modules[0].lessons[0], 
                 moduleProgress: 100 };

            totalLessons = currentModule.lessons.length;
            const completedLessons = currentModule.lessons.filter(lesson=>lesson.isCompleted).length

            const moduleProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
            const currentLesson = currentModule.lessons.find(lesson => !lesson.isCompleted);

            return {
                currentModule,
                currentLesson,
                moduleProgress,
                completedLessons
            };
        };

        let { currentModule, currentLesson, moduleProgress, 
            completedLessons

         } = currentModuleStatus();

        const completedModules = progressTracker.modules.map(m=>{
            if(m.isCompleted){
                return m.moduleId
            }
        })

        const courseProgress = calculateProgress(progressTracker.modules)

        const moduleIndex = progressTracker.modules.findIndex(m=>m.moduleId === currentModule.moduleId)

        let upcomingModule = null;

        if (moduleIndex !== -1 && moduleIndex + 1 < progressTracker.modules.length) {
            upcomingModule = progressTracker.modules[moduleIndex + 1];
        }

        const lessonData = await Course.aggregate([
            { $match: { _id: courseId } },
            { $unwind: "$modules" },
            { $match: { "modules._id": currentModule.moduleId } },
            { $unwind: "$modules.lessons" },
            { $match: { "modules.lessons._id": currentLesson.lessonId } },
            { $replaceRoot: { newRoot: "$modules.lessons" } } 
        ]);

        const attachments = lessonData[0].attachments.map(ats=> {
            return {
                moduleId : moduleIndex + 1,
                lessonId : progressTracker.modules[moduleIndex].lessons.findIndex(les=>les.lessonId === lessonData[0]._id) + 1,
                moduleTitle : currentModule.moduleTitle,
                lessonTitle : currentLesson.lessonTitle,
                title : ats.title,
                link : ats.link,
                fileType : ats.link.split('.').pop()
            }
        })

        const finalLessonData = {
            ...lessonData[0],
            attachments,
            isCompleted : currentLesson.isCompleted,
            moduleId : currentModule.moduleId
        }
 
        const currentProgress = {
            currentModule,
            upcomingModule : {
                _id : upcomingModule ? upcomingModule.moduleId : null ,  
                title : upcomingModule ? upcomingModule.moduleTitle : null
            },
            currentLesson : finalLessonData,
            moduleProgress,
            courseProgress,
            currentLevel : courseProgress === 100 ? 5 : progressTracker.level.currentLevel,
            levelSize : progressTracker.level.levelSize,
            totalLessons,
            completedModules,
            completedLessons
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.PROGRESS_STATUS_SUCCESS, HttpStatus.OK,currentProgress);

    } catch (error) {
        console.log(STRING_CONSTANTS.PROGRESS_STATUS_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

// update lesson or module completion

export const changeLessonOrModuleStatus = async (req,res) => {
    
    try {
        const userId = req.user.id;

        const { lessonId, moduleId, courseId } = req.body

        console.log(req.body)
        
        const progressTracker = await ProgressTracker.findOne({ userId, courseId });

        if(!progressTracker || !lessonId)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const alreadyUpdated = await ProgressTracker.findOne({
            userId, 
            courseId, 
            "modules.moduleId": moduleId, 
            "modules.lessons": {
                $elemMatch: {
                    lessonId: lessonId,
                    isCompleted: true  
                }
            }
        });

        if(alreadyUpdated)
            return ResponseHandler.success(res, STRING_CONSTANTS.EXIST, HttpStatus.ALREADY_REPORTED);

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

// load selected lesson

export const loadSelectedLesson = async (req,res) => {
    
    try {
        const userId = req.user.id;
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

          const progressTracker = await ProgressTracker.findOne({userId , courseId})

          const module = progressTracker.modules.find(m=>m.moduleId===moduleId)
          const lesson = module.lessons.find(les=>les.lessonId === lessonId)

          const moduleIndex = progressTracker.modules.findIndex(m=>m.moduleId===moduleId)
          const lessonIndex = module.lessons.findIndex(les=>les.lessonId===lessonId)

          const attachments = lessonData[0].lesson.attachments.map(ats=> {
            return {
                moduleId : moduleIndex + 1, 
                lessonId : lessonIndex + 1,
                moduleTitle : module.moduleTitle,
                lessonTitle : lesson.lessonTitle,
                title : ats.title,
                link : ats.link,
                fileType : ats.link.split('.').pop()
            } 
        })

        if(!lessonData || lessonData.length === 0 )
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT)

        const result = {
            ...lessonData[0].lesson,
            attachments,
            moduleId,
            isCompleted : lesson.isCompleted,
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_CURRENT_LESSON_SUCCESS, HttpStatus.OK,result)        

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_CURRENT_LESSON_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

// progress reset

export const resetCourseProgress = async (req,res) => {
    
    try {
        const userId = req.user.id;
        const courseId = req.params.id

        const progressTracker = await ProgressTracker.findOne({ userId, courseId })

        if (!progressTracker) {
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        progressTracker.modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
              lesson.isCompleted = false;
            });
            module.isCompleted = false;
          });
      
        progressTracker.level.currentLevel = 1;

        progressTracker.resetCount += 1;

        await progressTracker.save()  

        return ResponseHandler.success(res, STRING_CONSTANTS.COURSE_PROGRESS_RESET_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.COURSE_PROGRESS_RESET_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}