import Category from "../../model/category.js";
import Course from "../../model/course.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { DATABASE_FIELDS, STRING_CONSTANTS } from "../../utils/stringConstants.js";

// view all courses

export const loadCourses = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const { search } = req.query
        const skip = (page - 1) * limit

        const searchQuery = {
             title : {$regex : search , $options : "i"}
        }

        const allCourses = await Course.find(search ? searchQuery : {})
        .skip(skip)
        .limit(limit)

        if(!allCourses || allCourses.length === 0) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, allCourses);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view pending requests

export const loadPendingRequest = async (req,res) => {
    
    try {
        const request = await Course.find({status : 'pending'})
        .select([
            DATABASE_FIELDS.ID,
            DATABASE_FIELDS.EMAIL,
            DATABASE_FIELDS.FIRST_NAME,
            DATABASE_FIELDS.STATUS,
            DATABASE_FIELDS.REASON
        ].join(' '));

        if(!request||request.length === 0) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, request);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// approve or reject course publication

export const approveOrRejectCourse = async (req,res) => {
    
    try {
        const {tutorId, courseId, input, reason} = req.body

        const course = await Course.findOne({_id : courseId , tutor : tutorId})

        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        if(course.status === 'approved' ) 
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);
        
        if(course.status === 'rejected') 
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);

        if(input === 'approve'){
            await Course.findByIdAndUpdate(tutorId,{
                status : 'approved',
                reason,
                isPublished : true
            })

            return ResponseHandler.success(res,`Verification approved for ${course?.title}`,HttpStatus.OK)
        } 
        else if(input === 'reject') {
            await Course.findByIdAndUpdate(tutorId,{status : 'rejected' , reason})
            return ResponseHandler.success(res,`Verification rejected for  ${course?.title}`,HttpStatus.OK)
        }   
        else return ResponseHandler.error(res, STRING_CONSTANTS.INVALID_INPUT, HttpStatus.BAD_REQUEST);

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}


// delete course 

export const deleteCourse = async (req,res) => {
    
    try {
        const course_Id = req.params.id
        const {tutorId} = req.body

        const course = await Course.findOne({_id : course_Id , tutor : tutorId})
        if(!course)  
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        await course.findOneAndDelete({_id : course_Id , tutor : tutorId})

        return ResponseHandler.success(res,STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.DELETION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Assign course to category

export const assignCategory = async (req,res) => {
    
    try {
        const { courseId, categoryId } = req.body

        const course = await Course.findById(courseId)
        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const category = await Category.findById(categoryId)
        if(!category) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        course.category = categoryId

        await course.save()

        return ResponseHandler.success(res,STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}