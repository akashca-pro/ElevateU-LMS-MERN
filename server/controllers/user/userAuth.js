import User from '../../model/user.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../../utils/generateToken.js'
import { generateOtpCode, saveOtp } from '../../utils/generateOtp.js'
import {sendToken,clearToken} from '../../utils/tokenManage.js'
import {sendEmailOTP, sendEmailResetPassword} from '../../utils/sendEmail.js'
import {randomInt} from 'node:crypto'
import 'dotenv/config'

// User Registration with OTP

export const registerUser = async (req,res) => {
    
    try {

        const { email, password ,
            firstName  } = req.body;
    
        const userExists = await User.findOne({email : email});
    
        if(userExists) return res.status(400).json({message : "User already exists"});


        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = new User({
            email,
            password : hashedPassword, 
            firstName,
        });
    
        await user.save();

        const {otp,otpExpires} = generateOtpCode();

        await saveOtp('user',email,otp,otpExpires);

        await sendEmailOTP(email,firstName,otp)

        return res.status(201).json({message : "otp sent to email"});

    } catch (error) {
        console.log(error);
        if(error.message='Invalid Email') return res.status(400).json(error.message)
        return res.status(400).json(error.message);
    }

}

// verify otp

export const verifyOtp = async (req, res) => {
    try {
      const { otp } = req.body;
  
      const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } }).select('-password')
  
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired OTP" });
      }
  
      user.isVerified = true
      user.otp = undefined
      user.otpExpires = undefined
      user.verificationExpires = undefined

      await user.save()

      const accessToken = generateAccessToken(user._id);

      sendToken(res,'userAccessToken',accessToken,1 * 24 * 60 * 60 * 1000)

      return res.status(200).json({ message: "OTP verified successfully",data : user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
//Login with JWT

export const loginUser = async (req,res) => {
   
    try {
        const {email,password,rememberMe} = req.body;

        const user = await User.findOne({email})
    
        if(!user)return res.status(404).json({message : "Invalid credentials"});
    
        
        if(!(await bcrypt.compare(password,user.password))){
            return res.status(404).json({message : "Incorrect password"});
        }

        if(!user.isVerified)return res.status(402).json({message : "User is not verified"})
        
       const accessToken = generateAccessToken(user._id);
       const refreshToken = generateRefreshToken(user._id);
    
        // Set access token as cookie (24 hour)
        sendToken(res,'userAccessToken',accessToken,1 * 24 * 60 * 60 * 1000)
    
        // Set refresh token as cookie (only if "Remember Me" is checked)
        if(rememberMe) sendToken(res,'userRefreshToken',refreshToken,7 * 24 * 60 * 60 * 1000);

        const data = await User.findOne({email}).select('email firstName lastName profileImage bio socialLinks phone dob _id') 

        return res.status(200).json({message : "Login successfull",user : data});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error generating Token"})
    }

}

//reset link generating for password reset

export const forgotPassword = async (req,res) => {
    
    try {
        const {email} = req.body;
        const emailExist = await User.findOne({email})

        if(!emailExist)return res.status(404).json({message : 'user not found'});

        const resetToken = randomInt(100000, 999999).toString();
        const resetTokenExpires = Date.now() + 10 * 60 * 1000;

        const user = await User.findOneAndUpdate({email}, 
            {otp : resetToken,
            otpExpires : resetTokenExpires} ,{new : true})

        await sendEmailResetPassword(user.email,user.firstName,resetToken);

        return res.status(200).json({message : 'Password reset otp sent to your email'})
        
    } catch (error) {
        console.log('from forgotpassword controller',error);
        return res.status(500).json({ message: 'Error sending password reset code', error: error.message });
    }

}

// verify the resetPassword token and create new password

export const verifyResetLink = async (req,res) => {
    
    try {
        const { password ,token } = req.body;

        const user = await User.findOne({
            otp : token , 
            otpExpires : { $gt : Date.now() }
        });

        if(!user) return res.status(400).json({message : 'Invalid or expired token'})

        const hashedPassword = await bcrypt.hash(password,10);

        if(!user.isVerified) user.isVerified = true
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.log('from verifyResetLink',error);
        res.status(500).json({message : 'Reset link verification failed'});
    }

}

// Refresh Token End point (Reissue Access Token)

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.user;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res,'userAccessToken',newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        return res.status(200).json({message : "Refresh Token Issued"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error generating new token based on refresh token"})
    }
    
}

// clear Token 

export const logoutUser = async (req,res) => {

    try {

        clearToken(res,'userAccessToken','userRefreshToken');
        console.log('hello')
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

        const {user,token} = req.user;

        sendToken(res,'userAccessToken',token,1 * 24 * 60 * 60 * 1000);

        return res.redirect(`${process.env.CLIENT_URL}/user/auth-success`);
        
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// google failure 

export const authFailure = async (req,res) => {

    res.status(404).json({ message: "Google authentication failed. Please try again." });
    
}

export const authLoad = async (req,res) => {
    
    try {
        const {id} = req.user

        const user = await User.findById(id)
        if(!user) return res.status(404).json({message : "Google authentication failed. Please try again."})
            
        return res.status(200).json({message : 'Google Authentication success',user})
        
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}