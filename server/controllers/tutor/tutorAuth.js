import Tutor from '../../model/tutor.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../../utils/generateToken.js'
import { generateOtpCode, saveOtp } from '../../utils/generateOtp.js'
import {sendToken,clearToken} from '../../utils/tokenManage.js'
import {sendEmailOTP, sendEmailResetPassword} from '../../utils/sendEmail.js'
import {randomInt} from 'node:crypto'

// Tutor register with otp

export const registerTutor = async (req,res) => {
    
    try {

        const { email , password ,
            firstName  } = req.body;
    
        const tutorExists = await Tutor.findOne({email : email});
    
        if(tutorExists) return res.status(400).json({message : "User already exists"});


        const hashedPassword = await bcrypt.hash(password,10);
        
        const tutor = new Tutor({
            email,
            password : hashedPassword, 
            firstName,
        });
    
        await tutor.save();

        // await generateOtp('tutor',email);
        const {otp,otpExpires} = generateOtpCode();

        await saveOtp('tutor',email,otp,otpExpires);

        await sendEmailOTP(email,firstName,otp);
        
        return res.status(201).json({message : "otp sent to email"});

    } catch (error) {
        console.log(error);
        if(error.message='Invalid Email') return res.status(400).json(error.message)
        return res.status(400).json(error.message);
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

         if(!tutor) return res.status(400).json({message : "Invalid or Expired OTP"});

        tutor.isVerified = true;
        tutor.otp = undefined;
        tutor.otpExpires = undefined;
        tutor.verificationExpires = undefined;
        await tutor.save();

        return res.json({message : 'OTP verified successfully'});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server error"})
    }

}

//Login with JWT

export const loginTutor = async (req,res) => {
   
    try {
        const {email,password,rememberMe} = req.body;

        const tutor = await Tutor.findOne({email});
    
        if(!tutor)return res.status(401).json({message : "Invalid credentials"});
    
        if(!(await bcrypt.compare(password,tutor.password))){
            return res.status(404).json({message : "Incorrect password"});
        }

        if(!tutor.isVerified)return res.status(403).json({message : "User is not verified"})
        
       const accessToken = generateAccessToken(tutor._id);
       const refreshToken = generateRefreshToken(tutor._id);
    
        // Set access token as cookie (24 hour)
        sendToken(res,'tutorAccessToken',accessToken,1 * 24 * 60 * 60 * 1000)
    
        // Set refresh token as cookie (only if "Remember Me" is checked)
        if(rememberMe) sendToken(res,'tutorRefreshToken',refreshToken,7 * 24 * 60 * 60 * 1000);
    
        const data = await Tutor.findOne({email}).select('_id email firstName lastName profileImage bio dob socialLinks expertise experience isAdminVerified status reason ')
    
        return res.status(200).json({message : "Login successfull",tutor : data});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error generating Token"})
    }

}

//reset link generating for password reset

export const forgotPassword = async (req,res) => {
    
    try {
        const {email} = req.body;
        const emailExist = await Tutor.findOne({email})

        if(!emailExist)return res.status(404).json({message : 'Tutor not found'});

        const resetToken = randomInt(100000, 999999).toString();
        const resetTokenExpires = Date.now() + 10 * 60 * 1000;

        const tutor = await Tutor.findOneAndUpdate({email}, 
            {otp : resetToken,
            otpExpires : resetTokenExpires} ,{new : true})

        await sendEmailResetPassword(tutor.email,tutor.firstName,resetToken);

        return res.status(200).json({message : 'Password reset otp sent to your email'})
        
    } catch (error) {
        console.log('from forgotpassword tutor controller',error);
        return res.status(500).json({ message: 'Error sending password reset code', error: error.message });
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

        if(!tutor) return res.status(400).json({message : 'Invalid or expired token'})

        const hashedPassword = await bcrypt.hash(password,10);

        if(!tutor.isVerified) tutor.isVerified = true
        tutor.password = hashedPassword;
        tutor.otp = undefined;
        tutor.otpExpires = undefined;

        await tutor.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.log('from verifyResetLink',error);
        res.status(500).json({message : 'Reset link verification failed'});
    }

}

// Refresh Token End point (Reissue Access Token)

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.tutor;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res,'tutorAccessToken',newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        return res.status(200).json({message : "Refresh Token Issued"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error generating new token based on refresh token"})
    }
    
}

// clear Token 

export const logoutTutor = async (req,res) => {

    try {

        clearToken(res,'tutorAccessToken','tutorRefreshToken');
        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log(error)
        res.status(500).json("Error logging out")

    }
    
}

// google callback

export const passportCallback = async (req,res) => {
    
    try {

        if(!req.user) return res.status(404).json({message : 'Google authentication failed'});

        const {tutor,token} = req.user;

        sendToken(res,'tutorAccessToken',token,1 * 24 * 60 * 60 * 1000);

        return res.redirect(`${process.env.CLIENT_URL}/tutor/auth-success`);
        
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        return res.status(500).json({ message: "Internal Server Error" });
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
        if(!tutor) return res.status(404).json({message : "Google authentication failed. Please try again."})

        return res.status(200).json({message : 'Google Authentication success',tutor})
        
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
