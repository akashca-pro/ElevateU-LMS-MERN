import 'dotenv/config'
import Admin from '../../model/admin.js'
import bcrypt from 'bcryptjs'
import { clearToken, sendToken } from '../../utils/tokenManage.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';

import HttpStatus from '../../utils/statusCodes.js';
import ResponseHandler from '../../utils/responseHandler.js';
import {STRING_CONSTANTS, DATABASE_FIELDS} from '../../utils/stringConstants.js';

//Admin register

export const registerAdmin = async (req,res) => {
    
    try {
        const {email,password,firstName} = req.body;

        const adminExist = await Admin.findOne({email});

        if(adminExist) 
            return ResponseHandler.error(res,STRING_CONSTANTS.EXIST ,HttpStatus.CONFLICT);

        const hashedPassword = await bcrypt.hash(password,10);

        await Admin.create({ email, password: hashedPassword, firstName });

        return ResponseHandler.success(res, STRING_CONSTANTS.REGISTRATION_SUCCESS, HttpStatus.OK);

    } catch (error) {
        console.log(STRING_CONSTANTS.REGISTRATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.REGISTRATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

//Admin login

export const loginAdmin = async (req,res) => {
    
    try {
        const {email,password,rememberMe} = req?.body;

        const admin = await Admin.findOne({email});

        if(!admin) return ResponseHandler.error(res, STRING_CONSTANTS.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

        if(!(await bcrypt.compare(password,admin.password)))
            return ResponseHandler.error(res, STRING_CONSTANTS.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);


        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        sendToken(res, process.env.ADMIN_ACCESS_TOKEN_NAME, accessToken, 1 * 24 * 60 * 60 * 1000);

        if(rememberMe) 
            sendToken(res, process.env.ADMIN_REFRESH_TOKEN_NAME, refreshToken,7 * 24 * 60 * 60 * 1000);

        const updatedData = await Admin.findOne({email})
        .select([
            DATABASE_FIELDS.FIRST_NAME, 
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.EMAIL, 
            DATABASE_FIELDS.PROFILE_IMAGE
        ].join(" "));

        return ResponseHandler.success(res, STRING_CONSTANTS.LOGIN_SUCCESS, HttpStatus.OK, updatedData)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOGIN_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOGIN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// clear Token logout

export const logoutAdmin = async (req,res) => {

    try {

        clearToken(res, process.env.ADMIN_ACCESS_TOKEN_NAME, process.env.ADMIN_REFRESH_TOKEN_NAME);

        return ResponseHandler.success(res, STRING_CONSTANTS.LOGOUT_SUCCESS, HttpStatus.OK)
      
    } catch (error) {
        console.log(STRING_CONSTANTS.LOGOUT_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOGOUT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
}

//Refresh token 

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.admin;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res, process.env.ADMIN_ACCESS_TOKEN_NAME, newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        return ResponseHandler.success(res, STRING_CONSTANTS.TOKEN_ISSUED, HttpStatus.OK)
       
    } catch (error) {
        console.log(STRING_CONSTANTS.TOKEN_ISSUE_ERROR, error);
        return  ResponseHandler.error(res, STRING_CONSTANTS.TOKEN_ISSUE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
}

// view admin profile

export const loadProfile = async (req,res) =>{

    try {
        const admin_ID = req.admin.id;

        const adminData = await Admin.findById(admin_ID)
        .select([
            DATABASE_FIELDS.FIRST_NAME, 
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.EMAIL, 
            DATABASE_FIELDS.PROFILE_IMAGE
        ].join(" "));

        if(!adminData) return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, adminData)
        
    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_FAILED, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)  
    }    

}

// update admin profile

export const updateProfile = async (req,res) => {
    
    try {
        const admin_ID = req.admin.id
        const admin = await Admin.findById(admin_ID)

        if(!admin)return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        const {email, firstName, lastName, profileImage} = req.body

        const updatedData = await Admin.findByIdAndUpdate(admin_ID,{
            email,
            firstName,
            lastName,
            profileImage
        },{new : true})
        .select([
            DATABASE_FIELDS.FIRST_NAME, 
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.EMAIL, 
            DATABASE_FIELDS.PROFILE_IMAGE
        ].join(" "));

        return ResponseHandler.success(res, STRING_CONSTANTS.UPDATION_SUCCESS, HttpStatus.OK, updatedData)

    } catch (error) {
        console.log(STRING_CONSTANTS.UPDATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.UPDATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)  
    }

}