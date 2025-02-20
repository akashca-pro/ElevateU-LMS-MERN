import 'dotenv/config'
import User from '../model/user.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../utils/generateToken.js'
import generateOtp from '../utils/generateOtp.js'
import {sendToken,clearToken} from '../utils/tokenManage.js'
import {sendEmailResetPassword} from '../utils/sendEmail.js'
import {randomInt} from 'node:crypto'


// User Registration with OTP

export const registerUser = async (req,res) => {
    
    try {

        const { email, password ,
            firstName, lastName, phone, profileImage, bio, socialLinks } = req.body;
    
        const userExists = await User.findOne({email : email});
    
        if(userExists) return res.status(400).json({message : "User already exists"});


        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = new User({
            email,
            password : hashedPassword, 
            firstName,
            lastName,
            phone,
            profileImage,
            bio,
            socialLinks
        });
    
        await user.save();

        await generateOtp('user',email);
        
        return res.status(201).json({message : "otp sent to email"});

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

        return res.json({message : 'OTP verified successfully'});

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

        const resetLink = `http://localhost:9000/api/user/reset-password?token=${resetToken}`

        await sendEmailResetPassword(user.email,user.firstName,resetLink);

        res.status(200).json({message : 'Password reset link sent to your email'})
        
    } catch (error) {
        console.log('from forgotpassword controller',error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }

}

// verify the resetPassword token and create new password

export const verifyResetLink = async (req,res) => {
    
    try {
        const token = req.query.token;
        const { newPassword } = req.body;

        const user = await User.findOne({
            otp : token , 
            otpExpires : { $gt : Date.now() }
        });

        if(!user) return res.status(400).json({message : 'Invalid or expired token'})

        const hashedPassword = await bcrypt.hash(newPassword,10);

        if(!user.isVerified) user.isVerified = true
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful Redirecting to login' });

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
        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log(error)
        res.status(500).json("Error logging out")

    }
    
}

// View Profile

export const loadProfile = async (req,res) => {
    
    try {
        const user_ID = req.params.id 
        const userData = await User.findById(user_ID,'email firstName lastName profileImage bio socialLinks phone')

        if(!userData)return res.status(404).json({message : 'user not found'})

        return res.status(200).json(userData)

    } catch (error) {
        console.log('Error loading user profile');
        res.status(500).json({ message: 'Error loading user profile', error: error.message });
    }

}

// Update profile

export const updateProfile = async (req,res) => {
    
    try {
        const user_ID = req.params.id;
        const user = await User.findById(user_ID)
        if(!user) return res.status(404).json({message : 'user not found'});

        const {firstName, lastName, profileImage, phone, bio, socialLinks } = req.body;

        const updatedData = await User.findByIdAndUpdate(user_ID , {
            firstName,
            lastName,
            profileImage,
            phone,
            bio,
            socialLinks
        } , {new : true })
        .select('firstName lastName profileImage phone bio socialLinks')

        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating user profile');
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }

}
