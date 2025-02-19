import 'dotenv/config'
import User from '../model/user.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../utils/generateToken.js'
import generateOtp from '../utils/generateOtp.js'
import {sendToken,clearToken} from '../utils/tokenManage.js'


// User Registration with OTP

export const registerUser = async (req,res) => {
    
    try {

        const { email , password ,
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

        await generateOtp('user',email);
        
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
    
        const user = await User.findOne({ email });

         if(!user || user.otp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({message : "Invalid otp or Expired otp"});
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({message : 'OTP verified successfully'});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server error"})
    }

}

//Login with JWT

export const loginUser = async (req,res) => {
   
    try {
        const {email,password,rememberMe} = req.body;

        const user = await User.findOne({email});
    
        if(!user)return res.status(401).json({message : "Invalid credentials"});
    
        if(!(await bcrypt.compare(password,user.password))){
            return res.status(401).json({message : "Incorrect password"});
        }

        if(!user.isVerified)return res.status(401).json({message : "User is not verified"})
        
       const accessToken = generateAccessToken(user._id);
       const refreshToken = generateRefreshToken(user._id);
    
        // Set access token as cookie (24 hour)
        sendToken(res,'userAccessToken',accessToken,1 * 24 * 60 * 60 * 1000)
    
        // Set refresh token as cookie (only if "Remember Me" is checked)
        if(rememberMe) sendToken(res,'userRefreshToken',refreshToken,7 * 24 * 60 * 60 * 1000);
    
        res.status(200).json({message : "Login successfull"});

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Error generating Token"})
    }

}

// Refresh Token End point (Reissue Access Token)

export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.user;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res,'userAccessToken',newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        res.status(200).json({message : "Refresh Token Issued"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error generating new token based on refresh token"})
    }
    
}

// clear Token 

export const logoutUser = async (req,res) => {

    try {

        clearToken(res,'userAccessToken','userRefreshToken');
        res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log(error)
        res.status(500).json("Error logging out")

    }
    
}
