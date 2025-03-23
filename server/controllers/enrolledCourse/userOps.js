import EnrolledCourse from "../../model/enrolledCourses.js";
import Course from "../../model/course.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";
import ResponseHandler from "../../utils/responseHandler.js";
import Order from "../../model/order.js";
import User from "../../model/user.js";


// add to cart

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.id;

        const user = await User.findById(userId);

        if (user?.cart?.toString() === courseId) {
            return ResponseHandler.success(res, STRING_CONSTANTS.EXIST, HttpStatus.BAD_REQUEST);
        }

        await User.findByIdAndUpdate(userId, { $set: { cart: courseId } });

        return ResponseHandler.success(res, STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

// retrieve from cart 

export const getCartDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartDetails = await User.findOne({ _id: userId, cart: { $ne: null } })
            .select("name firstName email phone profileImage _id") 
            .populate({
                path: "cart",
            });

        if (!cartDetails || !cartDetails.cart) {
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, cartDetails);
    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

// enroll course

export const enrollInCourse = async (req,res) => {
    
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const course  = await Course.findOne({_id : courseId , isPublished : true})
        if(!course) 
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);
        
        const alreadyEnrolled = await EnrolledCourse.findOne({user : userId , course : courseId})

        if(alreadyEnrolled) 
            return ResponseHandler.success(res, STRING_CONSTANTS.EXIST, HttpStatus.ALREADY_REPORTED);

        const orderDetails = await Order.findOne({ userId, courseId })

        if(!orderDetails.paymentStatus === 'success')
            return ResponseHandler.error(res, 'Payment is not done', HttpStatus.BAD_REQUEST);

        await EnrolledCourse.create({
            userId,
            courseId,
            paymentDetails : {
                transactionId : orderDetails.paymentDetails.transactionId,
                amountPaid : orderDetails.price.finalPrice,
                orderId : orderDetails._id
            }
        })
        
        await User.findByIdAndUpdate(userId,{ $addToSet : { enrolledCourses : courseId } })

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

// load enrolled course

export const loadEnrolledCourse = async (req,res) => {

    try {
        const userId = req.user.id;
        const courseId  = req.params.id;
        
        const course = await EnrolledCourse.findOne({ userId , courseId });

        if(!course)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK,course);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER,HttpStatus.INTERNAL_SERVER_ERROR)
    }

}