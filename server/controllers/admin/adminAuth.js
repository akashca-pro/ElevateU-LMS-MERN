import Admin from '../../model/admin.js'
import bcrypt from 'bcryptjs'
import { clearToken, sendToken } from '../../utils/tokenManage.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';

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

// clear Token logout

export const logoutAdmin = async (req,res) => {

    try {

        clearToken(res,'adminAccessToken','adminRefreshToken');
        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        
        console.log('Error logging out admin ',error);
        res.status(500).json({ message: 'Error logging out admin', error: error.message });

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