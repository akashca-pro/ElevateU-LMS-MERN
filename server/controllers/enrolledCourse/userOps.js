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
        const userId = req.user.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const {search, filter} = req.query

        let sort = { createdAt: -1 }; // Default sorting (Newest first)
        let filterQuery = {user : userId}; 

        if (filter === "oldest") {
            sort = { createdAt: 1 }; // Oldest first
        }  

        if (search) {
            filterQuery.title =  { $regex: search, $options: "i" } 
        }   

        const totalCourse = await EnrolledCourse.countDocuments(filterQuery);

        const enrollments = await EnrolledCourse.find(filterQuery)
        .populate({
            path: "course",
            populate: { path: "tutor", select: "name email" }, 
        }).skip(skip)
        .limit(limit)
        .sort(sort)

        if(enrollments.length === 0) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)
            
        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, {
            enrollments,
            total: totalCourse, 
            currentPage: page,
            totalPages: Math.ceil(totalCourse / limit),
        })

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}