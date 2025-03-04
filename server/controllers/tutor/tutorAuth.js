import 'dotenv/config'
import Tutor from '../../model/tutor.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../../utils/generateToken.js'
import { generateOtpCode, saveOtp } from '../../utils/generateOtp.js'
import {sendToken,clearToken} from '../../utils/tokenManage.js'
import {sendEmailOTP, sendEmailResetPassword} from '../../utils/sendEmail.js'
import {randomInt} from 'node:crypto'
import HttpStatus from '../../utils/statusCodes.js'
import { DATABASE_FIELDS, STRING_CONSTANTS } from '../../utils/stringConstants.js'
import ResponseHandler from '../../utils/responseHandler.js'

// Tutor register with otp

export const registerTutor = async (req,res) => {
    
    try {

        const { email , password ,
            firstName  } = req.body;
    
        const tutorExists = await Tutor.findOne({email : email});
    
        if(tutorExists) 
            return ResponseHandler.error(res,STRING_CONSTANTS.EXIST ,HttpStatus.CONFLICT);


        const hashedPassword = await bcrypt.hash(password,10);
        
        const tutor = new Tutor({
            email,
            password : hashedPassword, 
            firstName,
        });
    
        await tutor.save();

        const {otp,otpExpires} = generateOtpCode();

        await saveOtp('tutor',email,otp,otpExpires);

        await sendEmailOTP(email,firstName,otp);
        
        return ResponseHandler.success(res, STRING_CONSTANTS.OTP_SENT, HttpStatus.OK);

    } catch (error) {
        console.log(STRING_CONSTANTS.REGISTRATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.REGISTRATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// verify otp

export const verifyOtp = async (req,res) => {
    
    try {
        const {otp} = req.body;
    
        const tutor = await Tutor.findOne({
            otp , 
            otpExpires : { $gt : Date.now() }
        });

         if(!tutor) 
            return ResponseHandler.error(res,STRING_CONSTANTS.OTP_ERROR ,HttpStatus.BAD_REQUEST);

        tutor.isVerified = true;
        tutor.otp = undefined;
        tutor.otpExpires = undefined;
        tutor.verificationExpires = undefined;
        await tutor.save();

        const accessToken = generateAccessToken(tutor._id)

        sendToken(res, process.env.TUTOR_ACCESS_TOKEN_NAME, accessToken, 1 * 24 * 60 * 60 * 1000);

        return ResponseHandler.success(res, STRING_CONSTANTS.VERIFICATION_SUCCESS, HttpStatus.OK);

    } catch (error) {
        console.log(STRING_CONSTANTS.VERIFICATION_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.VERIFICATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

//Login with JWT

export const loginTutor = async (req,res) => {
   
    try {
        const {email,password,rememberMe} = req.body;

        const tutor = await Tutor.findOne({email});
    
        if(!tutor)
            return ResponseHandler.error(res, STRING_CONSTANTS.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    
        if(!(await bcrypt.compare(password,tutor.password)))
            return ResponseHandler.error(res, STRING_CONSTANTS.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);

        if(!tutor.isVerified)
            return ResponseHandler.error(res,STRING_CONSTANTS.VERIFICATION_ERROR ,HttpStatus.NOT_ACCEPTABLE);
        
       const accessToken = generateAccessToken(tutor._id);
       const refreshToken = generateRefreshToken(tutor._id);
    
        // Set access token as cookie (24 hour)
        sendToken(res, process.env.TUTOR_ACCESS_TOKEN_NAME, accessToken, 1 * 24 * 60 * 60 * 1000)
    
        // Set refresh token as cookie (only if "Remember Me" is checked)
        if(rememberMe) 
            sendToken(res, process.env.TUTOR_REFRESH_TOKEN_NAME, refreshToken, 7 * 24 * 60 * 60 * 1000);
    
        const data = await Tutor.findOne({email})
        .select([
            DATABASE_FIELDS.ID,
            DATABASE_FIELDS.EMAIL,
            DATABASE_FIELDS.FIRST_NAME,
            DATABASE_FIELDS.LAST_NAME,
            DATABASE_FIELDS.PROFILE_IMAGE,
            DATABASE_FIELDS.BIO,
            DATABASE_FIELDS.DOB,
            DATABASE_FIELDS.IS_ADMIN_VERIFIED,
            DATABASE_FIELDS.EXPERTISE,
            DATABASE_FIELDS.EXPERIENCE,
            DATABASE_FIELDS.STATUS,
            DATABASE_FIELDS.REASON
        ].join(' '))
    
        return ResponseHandler.success(res, STRING_CONSTANTS.LOGIN_SUCCESS, HttpStatus.OK, data)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOGIN_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOGIN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

//reset link generating for password reset

export const forgotPassword = async (req,res) => {
    
    try {
        const {email} = req.body;
        const emailExist = await Tutor.findOne({email})

        if(!emailExist)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        const resetToken = randomInt(100000, 999999).toString();
        const resetTokenExpires = Date.now() + 10 * 60 * 1000;

        const tutor = await Tutor.findOneAndUpdate({email}, 
            {otp : resetToken,
            otpExpires : resetTokenExpires} ,{new : true})

        await sendEmailResetPassword(tutor.email,tutor.firstName,resetToken);

        return ResponseHandler.success(res, STRING_CONSTANTS.RESET_OTP, HttpStatus.OK)
        
    } catch (error) {
        console.log(STRING_CONSTANTS.OTP_SENT_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR) 
    }

}

// verify the resetPassword token and create new password
export const verifyResetLink = async (req,res) => {
    
    try {
        const { password ,token } = req.body;

        const tutor = await Tutor.findOne({
            otp : token , 
            otpExpires : { $gt : Date.now() }
        });

        if(!tutor) 
            return ResponseHandler.error(res,STRING_CONSTANTS.OTP_ERROR ,HttpStatus.BAD_REQUEST);

        const hashedPassword = await bcrypt.hash(password,10);

        if(!tutor.isVerified) tutor.isVerified = true
        tutor.password = hashedPassword;
        tutor.otp = undefined;
        tutor.otpExpires = undefined;

        await tutor.save();

        return ResponseHandler.success(res, STRING_CONSTANTS.PASSWORD_RESET_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.PASSWORD_RESET_ERROR, error);
        return  ResponseHandler.error(res, STRING_CONSTANTS.PASSWORD_RESET_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Refresh Token End point (Reissue Access Token)

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.tutor;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res, process.env.TUTOR_ACCESS_TOKEN_NAME, newAccessToken, 1 * 24 * 60 * 60 * 1000)
    
        return ResponseHandler.success(res, STRING_CONSTANTS.TOKEN_ISSUED, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.TOKEN_ISSUE_ERROR, error);
        return  ResponseHandler.error(res, STRING_CONSTANTS.TOKEN_ISSUE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
}

// clear Token 

export const logoutTutor = async (req,res) => {

    try {

        clearToken(res, process.env.TUTOR_ACCESS_TOKEN_NAME, process.env.TUTOR_REFRESH_TOKEN_NAME);
        
        return ResponseHandler.success(res, STRING_CONSTANTS.LOGOUT_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.LOGOUT_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOGOUT_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
}

// google callback

export const passportCallback = async (req,res) => {
    
    try {

        if(!req.user) 
            return ResponseHandler.error(res, STRING_CONSTANTS.GOOGLE_AUTH_ERROR, HttpStatus.NOT_FOUND)

        const {tutor,token} = req.user;

        sendToken(res, process.env.TUTOR_ACCESS_TOKEN_NAME,token, 1 * 24 * 60 * 60 * 1000);

        return res.status(HttpStatus.OK).redirect(`${process.env.CLIENT_URL}/tutor/auth-success`);
        
    } catch (error) {
        console.log(STRING_CONSTANTS.GOOGLE_AUTH_ERROR, error);
        return  ResponseHandler.error(res, STRING_CONSTANTS.GOOGLE_AUTH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// google failure 

export const authFailure = async (req,res) => {

    return res.redirect(`${process.env.CLIENT_URL}/user/login`);

}


export const authLoad = async (req,res) => {
    
    try {
        const {id} = req.tutor

        const tutor = await Tutor.findById(id)
        if(!tutor) 
            return ResponseHandler.error(res, STRING_CONSTANTS.GOOGLE_AUTH_ERROR, HttpStatus.NOT_FOUND)

        return ResponseHandler.success(res, STRING_CONSTANTS.GOOGLE_AUTH_SUCCESS, HttpStatus.OK,tutor)
        
    } catch (error) {
        console.log(STRING_CONSTANTS.GOOGLE_AUTH_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.GOOGLE_AUTH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}
