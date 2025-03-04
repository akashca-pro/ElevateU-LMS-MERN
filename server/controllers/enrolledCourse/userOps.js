import EnrolledCourse from "../../model/enrolledCourses.js";
import Course from "../../model/course.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";
import ResponseHandler from "../../utils/responseHandler.js";

// enroll course

export const enrollInCourse = async (req,res) => {
    
    try {
        const { userId , courseId } = req.body

        const course = await Course.findOne({_id : courseId , isPublished : true})
        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        const alreadyEnrolled = await EnrolledCourse.findOne({user : userId})

        if(alreadyEnrolled) 
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);
        
        await EnrolledCourse.create({
            user : userId,
            course : courseId
        })

        return ResponseHandler.success(res, STRING_CONSTANTS.CREATION_SUCCESS, HttpStatus.CREATED);

    } catch (error) {
        console.log(STRING_CONSTANTS.CREATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.CREATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// load enrolled courses

export const loadEnrolledCourses = async (req,res) => {
    
    try {
        const userId = req.params.id
        const course = await EnrolledCourse.find({user : userId})
        if(course.length === 0 || !course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)
            
        return res.status(HttpStatus.OK).json(course)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}