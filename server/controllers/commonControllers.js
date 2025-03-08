import User from "../model/user.js"
import Tutor from "../model/tutor.js"
import OTP from "../model/otp.js"
import { generateOtpCode, saveOtp } from "../utils/generateOtp.js"
import { sendEmailOTP, sendEmailResetPassword } from "../utils/sendEmail.js"
import HttpStatus from "../utils/statusCodes.js"
import ResponseHandler from "../utils/responseHandler.js"
import { DATABASE_FIELDS, STRING_CONSTANTS } from "../utils/stringConstants.js"
import Category from "../model/category.js"


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
        const categories = await Category.find().select([
            DATABASE_FIELDS.ID,
            DATABASE_FIELDS.NAME
        ])

        if(!categories) 
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS, HttpStatus.OK, categories);

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}
