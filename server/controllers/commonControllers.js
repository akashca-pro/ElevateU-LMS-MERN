import User from "../model/user.js"
import Tutor from "../model/tutor.js"
import { generateOtpCode, saveOtp } from "../utils/generateOtp.js"
import { sendEmailOTP, sendEmailResetPassword } from "../utils/sendEmail.js"

//Update Email

export const updateEmail = (role) =>{
    return async (req,res) => {

        const db = role==='user' ? User : Tutor

        try {
            const ID = req.params.id
            
            const {email} = req.body
    
            const data = await db.findById(ID)
            if(!data)return res.status(404).json({message : 'user not found'});
    
            const emailExist = await db.findOne({email , _id : {$ne : ID}})
            if(emailExist)return res.status(409).json({message : 'Email already exist'}) 
            
            data.tempMail = email;
            await data.save();
            
            const {otp,otpExpires} = generateOtpCode();
    
            await saveOtp(role,data.email,otp,otpExpires);
    
            sendEmailOTP(email,data.firstName,otp);
    
            res.status(200).json({message : 'OTP sent to your Email , verify on the next page'})
            
        } catch (error) {
            console.log('Error updating user Email');
            res.status(500).json({ message: 'Error updating user Email', error: error.message });
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
    
            if(!data) return res.status(400).json({message : 'Invalid or expired otp'});
            
            data.email = data.tempMail;
            data.tempMail = undefined;
            data.otp = undefined;
            data.otpExpires = undefined;
    
            await data.save()
    
            res.status(200).json({message : 'Email verification successfull , email updated '});
    
        } catch (error) {
            console.log('Error verifying user Email');
            res.status(500).json({ message: 'Error verifying user Email', error: error.message });
        }
    
    }
}

export const forgotPassword = async (req,res) => {
    
    

}

// re-send otp

export const reSendOtp = async (req,res) => {
        
    try {
        const {email ,role} = req.body
        const db = role === 'user' ? User : Tutor
        const {otp,otpExpires} = generateOtpCode();
        const user = await db.findOne({email})

        if(!user) return res.status(404).json({message : `${role} is not found`})

        user.otp = otp
        user.otpExpires = otpExpires

        await user.save()

        await sendEmailResetPassword(email,user.firstName,otp)

        return res.status(200).json({message : 'New OTP sent to your mail'})

    } catch (error) {
        console.log('Error Re-sending OTP');
        res.status(500).json({ message: 'Error Re-sending OTP', error: error.message });
    }

}
