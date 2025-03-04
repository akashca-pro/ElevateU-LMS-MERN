import User from "../model/user.js"
import Tutor from "../model/tutor.js"
import { generateOtpCode, saveOtp } from "../utils/generateOtp.js"
import { sendEmailOTP, sendEmailResetPassword } from "../utils/sendEmail.js"
import HttpStatus from "../utils/statusCodes.js"
import ResponseHandler from "../utils/responseHandler.js"
import { STRING_CONSTANTS } from "../utils/stringConstants.js"

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

// re-send otp

export const reSendOtp = async (req,res) => {
        
    try {
        const {email ,role} = req.body
        const db = role === 'user' ? User : Tutor
        const {otp,otpExpires} = generateOtpCode();
        const user = await db.findOne({email})

        if(!user) return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        user.otp = otp
        user.otpExpires = otpExpires

        await user.save()

        await sendEmailResetPassword(email,user.firstName,otp)

        return ResponseHandler.success(res, STRING_CONSTANTS.OTP_SENT, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.OTP_SENT_ERROR, error);
        return ResponseHandler.error(res, STRING_CONSTANTS.LOADING_ERROR, HttpStatus.INTERNAL_SERVER_ERROR) 
    }

}
