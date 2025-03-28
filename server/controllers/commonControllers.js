import User from "../model/user.js"
import Tutor from "../model/tutor.js"
import Admin from "../model/admin.js"
import OTP from "../model/otp.js"
import { generateOtpCode, saveOtp } from "../utils/generateOtp.js"
import { sendEmailOTP } from "../utils/sendEmail.js"
import HttpStatus from "../utils/statusCodes.js"
import ResponseHandler from "../utils/responseHandler.js"
import { DATABASE_FIELDS, STRING_CONSTANTS } from "../utils/stringConstants.js"
import Category from "../model/category.js"
import EnrolledCourse from "../model/enrolledCourses.js"
import Course from "../model/course.js"
import RefreshToken from "../model/refreshToken.js"
import { generateRefreshToken } from "../utils/generateToken.js"

const roleModals = {
    user : User,
    tutor : Tutor,
    admin : Admin
}

const sortingConditions = {
    'newest' : { createdAt : -1 },
    'oldest' : { createdAt : 1 },
    'price-high-low' : { price : -1 },
    'price-low-high' : { price : 1 },
    'rating-high-low': { rating : -1 }
}


//Update Email

export const updateEmail = (role) =>{
    return async (req,res) => {

        const db = role==='user' ? User : Tutor

        try {
            const ID = req.params.id
            
            const {email} = req.body
    
            const data = await db.findById(ID)
            if(!data)
                return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    
            const emailExist = await db.findOne({email , _id : {$ne : ID}})
            if(emailExist)
                return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);
            
            data.tempMail = email;
            await data.save();
            
            const {otp,otpExpires} = generateOtpCode();
    
            await saveOtp(role,data.email,otp,otpExpires);
    
            await sendEmailOTP(email,data.firstName,otp);
    
            return ResponseHandler.success(res, STRING_CONSTANTS.OTP_SENT, HttpStatus.OK)
            
        } catch (error) {
            console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
            return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    
    }
}

// verify Email

export const verifyEmail = (role) =>{
    return async (req,res) => {

        const db = role==='user' ? User : Tutor
    
        try {
            const {otp} = req.body;
            
            const data = await db.findOne({
                otp , 
                otpExpires : { $gt : Date.now() }
            });
    
            if(!data) 
                return ResponseHandler.error(res,STRING_CONSTANTS.OTP_ERROR ,HttpStatus.BAD_REQUEST);
            
            data.email = data.tempMail;
            data.tempMail = undefined;
            data.otp = undefined;
            data.otpExpires = undefined;
    
            await data.save()
    
            return ResponseHandler.success(res, STRING_CONSTANTS.VERIFICATION_SUCCESS, HttpStatus.OK);
    
        } catch (error) {
            console.log(STRING_CONSTANTS.VERIFICATION_ERROR, error);
            return ResponseHandler.error(res, STRING_CONSTANTS.VERIFICATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    
    }
}

// Send otp 

export const sendOtp = async(req,res) =>{
    
    try {
        const {role, firstName, email, otpType } = req.body;

        const db = roleModals[role]

        const emailExist = await db.findOne({ email })

        if(emailExist)
            return ResponseHandler.error(res, STRING_CONSTANTS.EXIST,HttpStatus.CONFLICT)

        const {otp} = generateOtpCode();

        await OTP.create({
            email,
            role,
            otp,
            otpType,
            otpExpires : new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmailOTP(email, firstName, otp)

        return ResponseHandler.success(res, STRING_CONSTANTS.OTP_SENT, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.OTP_SENT_ERROR, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.OTP_SENT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// verify otp 

export const verifyOtp = async (req,res) => {
    
    try {
        const {role, email, otp , otpType} = req.body;

        const otpRecord = await OTP.findOne({role , email , otp, otpType })
        
        if(!otpRecord) return ResponseHandler.error(res, STRING_CONSTANTS.OTP_ERROR, HttpStatus.BAD_REQUEST)
        
        await OTP.findByIdAndDelete(otpRecord._id)

        return ResponseHandler.success(res, STRING_CONSTANTS.VERIFICATION_SUCCESS, HttpStatus.OK)
        
    } catch (error) {
        console.log(STRING_CONSTANTS.VERIFICATION_ERROR, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.VERIFICATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Load categories 

export const loadCategories = async (req,res) => {
        
    try {
        const categories = await Category.find({isActive : true}).select([
            DATABASE_FIELDS.ID,
            DATABASE_FIELDS.NAME,
            DATABASE_FIELDS.ICON,
            DATABASE_FIELDS.DESCRIPTION
        ])

        if(!categories) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, categories);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Load course

export const getCourses = (sort) => async (req,res) => {
    
    try {
        let sortQuery;

        if(sort === 'top-rated'){
            sortQuery = {rating : -1}
        }else if(sort === 'best-selling'){
            sortQuery = {totalEnrollment : -1}
        }else if(sort === 'new-releases'){
            sortQuery = {createdAt : -1}
        }else if (sort === 'trending'){
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            const trendingEnrollments = await EnrolledCourse.aggregate( 
                [ {$match : { createdAt : {$gte : oneWeekAgo} } },
                  { $group : { _id : '$course' , count : { $sum : 1 } } },
                  { $sort : { count : -1 } },
                  { $limit : 10 }
                ]);
        
            const trendingCoursesIds = trendingEnrollments.map((e)=>e._id)
            const trendingCourses = await Course.find({ _id : { $in : trendingCoursesIds } , isPublished : true })
            .select('_id title tutor totalEnrollment category duration thumbnail rating')
            .populate('tutor','name profileImage')
            .exec()

            return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.ok,trendingCourses)
        };

        const courses = await Course.find({ isPublished :true })
        .select('_id title tutor totalEnrollment category duration thumbnail rating')
        .sort(sortQuery)
        .limit(10)
        .populate('tutor','firstName profileImage')
        .exec();

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.ok,courses)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR,error)
        return ResponseHandler.success(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Load Course details

export const loadCourseDetails = async (req,res) => {
    
    try {
        const courseId = req.params.id

        const course = await Course.findOne({ _id : courseId , isPublished : true})
        .populate('tutor' , 'firstName profileImage bio students courseCount rating expertise')

        if(!course)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const processedModules = course.modules.map(module=>({
            _id : module._id,
            title : module.title,
            lessons : module.lessons.map((lesson,index)=>{
                if(index === 0 ){
                    return {
                        _id : lesson._id,
                        title : lesson.title,
                        videoUrl : lesson.videoUrl,
                        duration : lesson.duration
                    }
                }else{
                    return {
                        _id : lesson._id,
                        title : lesson.title,
                        duration : lesson.duration
                    }
                }
            })

        }))

        
        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK,{
            _id : course._id,
            title : course.title,
            description : course.description,
            category : course.category,
            tutor : course.tutor,
            price : course.price,
            discount : course.discount,
            totalEnrollment : course.totalEnrollment,
            thumbnail : course.thumbnail,
            requirements : course.requirements,
            rating : course.rating,
            level : course.level,
            modules : processedModules,
            updatedAt : course.updatedAt,
            whatYouLearn : course.whatYouLearn,
            badge : course.badge
        })


    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// isBlock

export const isBlock = (role) => async (req,res) => {
    
    try {
        const Model = roleModals[role]
        const id = req[role].id;
        const user = await Model.findById(id)
        if(!user)
            return ResponseHandler.error(res, STRING_CONSTANTS.BLOCKED, HttpStatus.NOT_FOUND);

        if(user.isBlocked)
            return ResponseHandler.error(res, STRING_CONSTANTS.BLOCKED, HttpStatus.FORBIDDEN); 

        return ResponseHandler.success(res, STRING_CONSTANTS.SUCCESS, HttpStatus.OK, id)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

// load courses

export const loadCourses = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit

        let filter = {};
        let sort
        filter.isPublished = true
        if (req.query.filter) {
            try {
              const parsedFilter = JSON.parse(req.query.filter);

                sort = sortingConditions[parsedFilter.sort]
          
              if (parsedFilter.search) {
                filter.title = { $regex: parsedFilter.search, $options: "i" };
              }

              if(parsedFilter.category){
                filter.category = parsedFilter.category
              }
          
              if (parsedFilter.tutors && parsedFilter.tutors.length > 0) {
                filter.tutor = { $in: parsedFilter.tutors };
              }
          
              if (parsedFilter.rating) {
                filter.rating = { $gte: parsedFilter.rating };
              }
          
              if (parsedFilter.levels && parsedFilter.levels.length > 0) {
                filter.level = { $in: parsedFilter.levels };
              }
          
              if (parsedFilter.priceRange && parsedFilter.priceRange.length === 2) {
                filter.price = { $gte: parsedFilter.priceRange[0], $lte: parsedFilter.priceRange[1] };
              }

              if (parsedFilter.duration && parsedFilter.duration.length === 2) {
                filter.duration = { $gte: parsedFilter.duration[0], $lte: parsedFilter.duration[1] };
              }
          
              if (parsedFilter.hasCertification !== undefined) {
                filter.hasCertification = parsedFilter.hasCertification;
              }
              
            } catch (error) {
              return ResponseHandler.error(
                res,
                STRING_CONSTANTS.INVALID_FILTER,
                HttpStatus.BAD_REQUEST
              );
            }
          }

        const totalCourses = await Course.countDocuments(filter)

        const courses = await Course.find(filter)
        .populate('tutor', '_id firstName lastName')
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select('_id title description price rating duration hasCertification level thumbnail createdAt')


        if(!courses || courses.length === 0) 
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.ok,{
                courses: [],
                total: 0,
                currentPage: page,
                totalPages: 0,
              })


        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, {
            courses,
            total: totalCourses, 
            currentPage: page,
            totalPages: Math.ceil(totalCourses / limit),
            tutors : courses.map(course=>course.tutor)
        })


    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// search course titles 

export const loadCourseTitles = async (req,res) => {
    
    try {
        const searchQuery = req.query.search;

        let courseTitles

        if(searchQuery){
            courseTitles = await Course.find({ title : { $regex : `^${searchQuery}` , $options : 'i' }, 
            isPublished : true })
            .select('_id title')
        }
        
        if(!courseTitles || courseTitles.length === 0 || !searchQuery)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.OK,[])
        
        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK,courseTitles)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}