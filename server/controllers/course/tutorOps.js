import Course from '../../model/course.js'
import Tutor from '../../model/tutor.js'
import ResponseHandler from '../../utils/responseHandler.js'
import HttpStatus from '../../utils/statusCodes.js'
import { STRING_CONSTANTS } from '../../utils/stringConstants.js'

// create a course
export const createCourse = async (req,res) => {
    
    try {
        const {title, description, price, thumbnail , tutorId} = req.body

        const tutorCheck = await Tutor.findById(tutorId)
        if(!tutorCheck) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const existingCourse = await Course.findOne({ title, tutor: tutorId });
        if (existingCourse) 
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);

        await Course.create({
            title,
            description,
            tutor: tutorId,  
            price,
            thumbnail
        });

        return ResponseHandler.success(res, STRING_CONSTANTS.CREATION_SUCCESS, HttpStatus.CREATED)

    } catch (error) {
        console.log(STRING_CONSTANTS.CREATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.CREATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view all uploaded courses

export const loadCourses = async (req,res) => {
    
    try {
        const {tutorId} = req.body
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {title : {$regex : search , $options : 'i'} , tutor : tutorId}

        const course = await Course.find(search ? searchQuery : {tutor : tutorId})
        .skip(skip)
        .limit(limit)

        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, course)
            
    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view specific course

export const courseDetails = async (req,res) => {
    
    try {
        const {tutorId , courseId} = req.body

        const courseDetails = await Course.findOne({_id : courseId , tutor : tutorId})
        if(!courseDetails) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, courseDetails)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// update course

export const updateCourse = async (req, res) => {
    try {
      const { title, description, price, thumbnail, tutorId ,courseId} = req.body;

      const course = await Course.findOne({_id : courseId , tutor : tutorId});
      if (!course) 
        return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
      
      const existingCourse = await Course.findOne({ title, tutor: tutorId, _id: { $ne: courseId } });
      if (existingCourse) 
        return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);
  
      course.title = title;
      course.description = description;
      course.price = price;
      course.thumbnail = thumbnail;
  
      await course.save();
  
      return ResponseHandler.success(res,STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
};
  
// publish course

export const requestPublish = async (req,res) => {
    
    try {
        const {tutorId, courseId} = req.body
        const course = await Course.findOne({_id : courseId , tutor : tutorId})

        if (!course) return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        if(course.isPublished || course.isApproved === "approved") 
             return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);

        course.isApproved = 'pending';

        await course.save();

        return ResponseHandler.success(res,"Course Approve requested , after verifying course will be published", HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// delete course 

export const deleteCourse = async (req,res) => {
    
    try {
        const {tutorId , courseId} = req.body

        const course = await Course.findOne({_id : courseId , tutor : tutorId})

        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        await Course.findOneAndDelete({_id : courseId , tutor : tutorId})

        return ResponseHandler.success(res,STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.DELETION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}
