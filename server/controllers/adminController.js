import 'dotenv/config'
import Admin from '../model/admin.js'
import bcrypt from 'bcryptjs'
import {generateAccessToken,generateRefreshToken} from '../utils/generateToken.js'
import {sendToken ,clearToken} from '../utils/tokenManage.js'

import User from '../model/user.js'
import Tutor from '../model/tutor.js'


//Admin register
export const registerAdmin = async (req,res) => {
    
    try {
        const {email,password,firstName} = req.body;

        const adminExist = await Admin.findOne({email});

        if(adminExist) return res.status(400).json({message : "Admin already exists"});

        const hashedPassword = await bcrypt.hash(password,10);

        const admin = new Admin({
            email,
            password : hashedPassword,
            firstName,
        })

        await admin.save();

        return res.status(200).json({message : 'Admin registration successfull'});

    } catch (error) {
        console.log('Error registering admin ',error);
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }

}

//Admin login

export const loginAdmin = async (req,res) => {
    
    try {
        const {email,password,rememberMe} = req.body

        const admin = await Admin.findOne({email})

        if(!admin)res.status(401).json({message : "Invalid credentials"});

        if(!(await bcrypt.compare(password,admin.password))){
            return res.status(401).json({message : "Incorrect password"});
        }

        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        sendToken(res,'adminAccessToken',accessToken,1 * 24 * 60 * 60 * 1000);

        if(rememberMe) sendToken(res,'adminRefreshToken',refreshToken,7 * 24 * 60 * 60 * 1000);

        return res.status(200).json({message : 'admin login successfull'});

    } catch (error) {
        console.log('Error logging in admin ',error);
        res.status(500).json({ message: 'Error logging in admin', error: error.message });
    }

}

//Refresh token 
export const refreshToken = async (req,res) => {
   
    try {
        const {decoded} = req.admin;
        const newAccessToken = generateAccessToken(decoded);

        sendToken(res,'adminAccessToken',newAccessToken,1 * 24 * 60 * 60 * 1000)
    
        return res.status(200).json({message : "Refresh Token Issued"})

    } catch (error) {
        console.log('Error refreshing token for admin ',error);
        res.status(500).json({ message: 'Error refreshing token for admin ', error: error.message });
    }
    
}

// clear Token
export const logoutAdmin = async (req,res) => {

    try {

        clearToken(res,'adminAccessToken','adminRefreshToken');
        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log('Error logging out admin ',error);
        res.status(500).json({ message: 'Error logging out admin', error: error.message });

    }
    
}

// view admin profile

export const loadProfile = async (req,res) =>{

    try {
        const admin_ID = req.params.id;

        const adminData = await Admin.findById(admin_ID);

        if(!adminData) return res.status(404).json({message : 'admin data is not found'})

        return res.status(200).json({
            email : adminData.email,
            firstName : adminData.firstName,
            lastName : adminData.lastName,
            profileImage : adminData.profileImage
        })
        
    } catch (error) {
        console.log('Error loading admin profile',error);
        res.status(500).json({ message: 'Error loading admin profile', error: error.message });
    }    

}

// update admin profile

export const updateProfile = async (req,res) => {
    
    try {
        const admin_ID = req.params.id
        const admin = await Admin.findById(admin_ID)
        if(!admin)return res.status(404).json({message : 'admin details not found'});

        const {email, firstName, lastName, profileImage} = req.body

        const updatedData = await Admin.findByIdAndUpdate(admin_ID,{
            email,
            firstName,
            lastName,
            profileImage
        },{new : true}).select('email firstName lastName profileName')

        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating admin profile',error);
        res.status(500).json({ message: 'Error updating admin profile', error: error.message });
    }

}

// create user

export const addUser = async (req,res) => {
    
    try {
        const {email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks, isVerified, isActive, isBlocked} = req.body;

        const emailExist = await User.findOne({email})
        if(emailExist) return res.status(409).json({message : 'user already exist'})    

        const user = new User({
            email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks,
             isVerified : isVerified === 'true',
             isActive : isActive === 'true' ,
             isBlocked : isBlocked === 'true'
        })

        await user.save()

        return res.status(200).json({message : 'user added successfully'})

    } catch (error) {
        console.log('Error adding user profile',error);
        res.status(500).json({ message: 'Error adding user profile', error: error.message });
    }

}

// view users details

export const loadUsers = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {
            $or : [
                {firstName : {$regex : search, $options : 'i'} },
                {lastName : {$regex : search, $options : 'i'} },
                {email : {$regex : search, $options : 'i'} }
            ]
        }

        const userData = await User.find(search ? searchQuery : {})
        .select('email firstName lastName profileImage isVerified isActive isBlocked enrolledCourses')
        .skip(skip)
        .limit(limit)

        if(!userData || userData.length === 0) return res.status(404).json({message : 'user not found'})

        return res.status(200).json(userData) 
        
    } catch (error) {
        console.log('Error viewing users profiles',error);
        res.status(500).json({ message: 'Error viewing users profiles', error: error.message });
    }

}

// view specific user details

export const loadUserDetails = async (req,res) => {
    
    try {
        const user_ID = req.params.id
        const user = await User.findById(user_ID)
        .select('email firstName lastName profileImage isVerified isActive isBlocked enrolledCourses')

        if(!user) return res.status(404).json({message : 'user not found'})
            
        return res.status(200).json(user)

    } catch (error) {
        console.log('Error viewing user profile',error);
        res.status(500).json({ message: 'Error viewing user profile', error: error.message });
    }

} 

// update user details

export const updateUserDetails = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id;
        const userData = await User.findById(user_ID);
        if(!userData) return res.status(404).json({message : 'user not found'});

        const {firstName, lastName, profileImage, enrolledCourses,
             isVerified, isActive, isBlocked } = req.body

        const updatedFields = {
            firstName , lastName , profileImage , enrolledCourses
        }

        if(isVerified !== undefined) updatedFields.isVerified = isVerified === 'true'

        if(isActive !== undefined) updatedFields.isActive = isActive === 'true'

        if(isBlocked !== undefined) updatedFields.isBlocked = isBlocked === 'true' 

        const updatedData = await User.findByIdAndUpdate(
            user_ID, 
            updatedFields ,
            {new : true})
            .select(['firstName', 'lastName', 'profileImage', 'enrolledCourses', 'isVerified',
             'isActive', 'isBlocked','bio', 'socialLinks'])
             
        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating user profile',error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }

}

// delete user

export const deleteUser = async (req,res) => {
    
    try {
        
        const user_ID = req.params.id

        const user = await User.findById(user_ID)
        if(!user) return res.status(404).json({message : 'user not found'})
        
        await User.findByIdAndDelete(user_ID)

        return res.status(200).json({message : 'user deleted successfully'})

    } catch (error) {
        console.log('Error deleting user profile',error);
        res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }

}

// create tutor

export const addTutor = async (req,res) => {
    
    try {
        const {email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks ,expertise ,experience, earnings, 
             isVerified, isActive, isBlocked ,isAdminVerified} = req.body;

        const emailExist = await Tutor.findOne({email})
        if(emailExist) return res.status(409).json({message : 'tutor already exist'})    

        const tutor = new Tutor({
            email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks,expertise ,experience, earnings,
             isVerified : isVerified === 'true',
             isActive : isActive === 'true' ,
             isBlocked : isBlocked === 'true',
             isAdminVerified : isAdminVerified === 'true'
        })

        await tutor.save()

        return res.status(200).json({message : 'tutor added successfully'})

    } catch (error) {
        console.log('Error adding tutor profile',error);
        res.status(500).json({ message: 'Error adding tutor profile', error: error.message });
    }

}

// view tutors details

export const loadTutors = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {
            $or : [
                {firstName : {$regex : search, $options : 'i'} },
                {lastName : {$regex : search, $options : 'i'} },
                {email : {$regex : search, $options : 'i'} }
            ]
        }

        const tutorData = await Tutor.find(search ? searchQuery : {})
        .select('email firstName lastName profileImage isVerified isActive isBlocked isAdminVerified expertise experience earnings')
        .skip(skip)
        .limit(limit)

        if(!tutorData || tutorData.length === 0) return res.status(404).json({message : 'user not found'})

        return res.status(200).json(tutorData) 
        
    } catch (error) {
        console.log('Error viewing tutors profiles',error);
        res.status(500).json({ message: 'Error viewing tutors profiles', error: error.message });
    }

}

// view specific tutor details

export const loadTutorDetails = async (req,res) => {
    
    try {
        const tutor_ID = req.params.id
        const tutor = await Tutor.findById(tutor_ID)
        .select('email firstName lastName profileImage isVerified isActive isBlocked isAdminVerified expertise experience earnings')

        if(!tutor) return res.status(404).json({message : 'tutor not found'})
            
        return res.status(200).json(tutor)

    } catch (error) {
        console.log('Error viewing tutor profile',error);
        res.status(500).json({ message: 'Error viewing tutor profile', error: error.message });
    }

} 

// update tutor details

export const updateTutorDetails = async (req,res) => {
    
    try {
        
        const tutor_ID = req.params.id;
        const tutorData = await Tutor.findById(tutor_ID);
        if(!tutorData) return res.status(404).json({message : 'tutor not found'});

        const {firstName, lastName, profileImage, expertise, experience, earnings,
             isVerified, isActive, isBlocked, isAdminVerified } = req.body

        const updatedFields = {
            firstName , lastName , profileImage , expertise , experience , earnings
        }

        if(isVerified !== undefined) updatedFields.isVerified = isVerified === 'true'

        if(isActive !== undefined) updatedFields.isActive = isActive === 'true'

        if(isBlocked !== undefined) updatedFields.isBlocked = isBlocked === 'true' 

        if(isAdminVerified !== undefined) updatedFields.isAdminVerified = isAdminVerified === 'true'

        const updatedData = await Tutor.findByIdAndUpdate(
            tutor_ID, 
            updatedFields ,
            {new : true})
            .select(['firstName', 'lastName', 'profileImage', 'expertise', 'experience','earnings',
                 'isVerified','isActive', 'isBlocked', 'isAdminVerified'])
             
        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating tutor profile',error);
        res.status(500).json({ message: 'Error updating tutor profile', error: error.message });
    }

}

// delete tutor

export const deleteTutor = async (req,res) => {
    
    try {
        
        const tutor_ID = req.params.id

        const tutor = await Tutor.findById(tutor_ID)
        if(!tutor) return res.status(404).json({message : 'tutor not found'})
        
        await Tutor.findByIdAndDelete(tutor_ID)

        return res.status(200).json({message : 'tutor deleted successfully'})

    } catch (error) {
        console.log('Error deleting tutor profile',error);
        res.status(500).json({ message: 'Error deleting tutor profile', error: error.message });
    }

}