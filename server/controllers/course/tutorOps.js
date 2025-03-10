import Course from '../../model/course.js'
import Tutor from '../../model/tutor.js'
import ResponseHandler from '../../utils/responseHandler.js'
import HttpStatus from '../../utils/statusCodes.js'
import { STRING_CONSTANTS } from '../../utils/stringConstants.js'

// create a course
export const createCourse = async (req,res) => {
    
    try {
        const {formData, draft} = req.body
        const tutorId = req.tutor.id

        const tutorCheck = await Tutor.findById(tutorId)
        if(!tutorCheck) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const titleExist = await Course.findOne({title : formData.title , tutor : tutorId})
        if(titleExist)
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT)

        if(tutorCheck.draftCount >= 3 && draft)
            return ResponseHandler.error(res, STRING_CONSTANTS.DRAFT_LIMIT, HttpStatus.FORBIDDEN);

        await Course.create({
            ...formData,
            title : formData.title.trim(),
            tutor : tutorId,
            draft : draft ? true : false,
            status : !draft ? 'pending' : 'draft' 
        });

        return ResponseHandler.success(res, STRING_CONSTANTS.CREATION_SUCCESS, HttpStatus.CREATED)

    } catch (error) {
        console.log(STRING_CONSTANTS.CREATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.CREATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, error)
    }

}

// view all uploaded courses

export const loadCourses = async (req,res) => {
    
    try {
        const tutorId = req.tutor.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const {search, filter} = req.query

        let sort = { createdAt: -1 }; // Default sorting (Newest first)
        let filterQuery = {tutor : tutorId}; 

        if (filter === "oldest") {
            sort = { createdAt: 1 }; // Oldest first
        } else if (filter === "Draft") {
            filterQuery.status = 'draft'
        } else if (filter === "active") {
            filterQuery.status = 'approved';
        }

        if (search) {
            filterQuery.title =  { $regex: search, $options: "i" } 
        }   

        const totalCourse = await Course.countDocuments(filterQuery);

        const course = await Course.find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sort)

        if(!course || course.length === 0) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, {
            courses : course,
            total: totalCourse, 
            currentPage: page,
            totalPages: Math.ceil(totalCourse / limit),
        })
            
    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view specific course

export const courseDetails = async (req,res) => {
    
    try {
        const courseId = req.params.id
        const tutorId = req.tutor.id
     

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
      const { formData } = req.body;
      const tutorId = req.tutor.id
      const courseId = formData._id

      const course = await Course.findOne({_id : courseId , tutor : tutorId});
      if (!course) 
        return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

      formData.draft = false

      await Course.findByIdAndUpdate(courseId,formData);
  
      return ResponseHandler.success(res,STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK);

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
        const tutorId = req.tutor.id
        const courseId = req.params.id

        const course = await Course.findOne({_id : courseId , tutor : tutorId});

        if(!course) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        await Course.findOneAndDelete({_id : courseId , tutor : tutorId})

        return ResponseHandler.success(res,STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.DELETION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Title already exist 

export const courseTitleExist = async (req,res) => {
    
    try {
        const tutorId = req.tutor.id;
        const title = req.params.title;

        const titleExist = await Course.findOne({title : title , tutor : tutorId})
        if(titleExist)
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT)

        return ResponseHandler.success(res, undefined, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.EXIST, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

