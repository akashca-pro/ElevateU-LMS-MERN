import User from '../../model/user.js'
import ResponseHandler from '../../utils/responseHandler.js';
import HttpStatus from '../../utils/statusCodes.js';
import { DATABASE_FIELDS, STRING_CONSTANTS } from '../../utils/stringConstants.js';

// create user

export const addUser = async (req,res) => {
    
    try {
        const {email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks, isVerified, isActive, isBlocked} = req.body;

        const emailExist = await User.findOne({email})
        if(emailExist)
             return ResponseHandler.error(res, STRING_CONSTANTS.EXIST, HttpStatus.CONFLICT);   

        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone,
            profileImage,
            enrolledCourses,
            bio,
            socialLinks,
            isVerified: isVerified === 'true',
            isActive: isActive === 'true',
            isBlocked: isBlocked === 'true',
        });

        return ResponseHandler.success(res, STRING_CONSTANTS.CREATION_SUCCESS, HttpStatus.CREATED,user)

    } catch (error) {
        console.log(STRING_CONSTANTS.CREATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.CREATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view users details

export const loadUsers = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {
            $or : [
                {firstName : {$regex : search, $options : 'i'} },
                {lastName : {$regex : search, $options : 'i'} },
                {email : {$regex : search, $options : 'i'} }
            ]
        }

        const userData = await User.find(search ? searchQuery : {})
        .skip(skip)
        .limit(limit)
        .select([
            DATABASE_FIELDS.EMAIL,
            DATABASE_FIELDS.FIRST_NAME,
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.PROFILE_IMAGE,
            DATABASE_FIELDS.IS_VERIFIED,
            DATABASE_FIELDS.IS_ACTIVE,
            DATABASE_FIELDS.IS_BLOCKED,
            DATABASE_FIELDS.ENROLLED_COURSES
        ].join(' '));

        if(!userData || userData.length === 0) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, userData);
        
    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// view specific user details

export const loadUserDetails = async (req,res) => {
    
    try {
        const user_ID = req.params.id
        const user = await User.findById(user_ID)
        .select([
            DATABASE_FIELDS.EMAIL,
            DATABASE_FIELDS.FIRST_NAME,
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.PROFILE_IMAGE,
            DATABASE_FIELDS.IS_VERIFIED,
            DATABASE_FIELDS.IS_ACTIVE,
            DATABASE_FIELDS.IS_BLOCKED,
            DATABASE_FIELDS.ENROLLED_COURSES
        ].join(' '));

        if(!user) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
            
        return ResponseHandler.success(res,STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, user)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

} 

// update user details

export const updateUserDetails = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id;
        const userData = await User.findById(user_ID);
        if(!userData) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const {firstName, lastName, profileImage, enrolledCourses,
             isVerified, isActive, isBlocked } = req.body

        const updatedFields = {
            firstName , lastName , profileImage , enrolledCourses
        }

        if(isVerified !== undefined) updatedFields.isVerified = isVerified === 'true'

        if(isActive !== undefined) updatedFields.isActive = isActive === 'true'

        if(isBlocked !== undefined) updatedFields.isBlocked = isBlocked === 'true' 

        await User.findByIdAndUpdate(
            user_ID, 
            updatedFields)
             
        return ResponseHandler.success(res,STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// delete user

export const deleteUser = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id

        const user = await User.findById(user_ID)
        if(!user) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        await User.findByIdAndDelete(user_ID)

        return ResponseHandler.success(res,STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR, error);
        return ResponseHandler.error(res,STRING_CONSTANTS.DELETION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}