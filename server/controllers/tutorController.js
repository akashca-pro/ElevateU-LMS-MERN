import 'dotenv/config'
import Tutor from '../model/tutor.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../utils/generateToken.js'
import generateOtp from '../utils/generateOtp.js'
import {sendToken,clearToken} from '../utils/tokenManage.js'

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

        await generateOtp('tutor',email);
        
        res.status(201).json({message : "otp sent to email"});

    } catch (error) {
        console.log(error);
        if(error.message='Invalid Email') return res.status(400).json(error.message)
        res.status(400).json(error.message);
    }

}

// verify otp

export const verifyOtp = async (req,res) => {
    
    try {
        const {email,otp} = req.body;
    
        const tutor = await Tutor.findOne({ email });

         if(!tutor || tutor.otp !== otp || tutor.otpExpires < Date.now()){
            return res.status(400).json({message : "Invalid otp or Expired otp"});
        }

        tutor.isVerified = true;
        tutor.otp = undefined;
        tutor.otpExpires = undefined;
        await tutor.save();

        res.json({message : 'OTP verified successfully'});

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
            return res.status(401).json({message : "Incorrect password"});
        }

        if(!tutor.isVerified)return res.status(403).json({message : "User is not verified"})
        
       const accessToken = generateAccessToken(tutor._id);
       const refreshToken = generateRefreshToken(tutor._id);
    
        // Set access token as cookie (24 hour)
        sendToken(res,'tutorAccessToken',accessToken,1 * 24 * 60 * 60 * 1000)
    
        // Set refresh token as cookie (only if "Remember Me" is checked)
        if(rememberMe) sendToken(res,'tutorRefreshToken',refreshToken,7 * 24 * 60 * 60 * 1000);
    
        res.status(200).json({message : "Login successfull"});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error generating Token"})
    }

}

// Refresh Token End point (Reissue Access Token)

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.tutor;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res,'tutorAccessToken',newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        res.status(200).json({message : "Refresh Token Issued"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error generating new token based on refresh token"})
    }
    
}

// clear Token 

export const logoutTutor = async (req,res) => {

    try {

        clearToken(res,'tutorAccessToken','tutorRefreshToken');
        res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log(error)
        res.status(500).json("Error logging out")

    }
    
}

