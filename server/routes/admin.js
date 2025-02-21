import express from 'express'
import {loginAdmin,registerAdmin,logoutAdmin,refreshToken,loadProfile,updateProfile,
    loadUserDetails,loadUsers,updateUserDetails,deleteUser,addUser,
    addTutor,loadTutors,loadTutorDetails,updateTutorDetails,deleteTutor
} from '../controllers/adminController.js'

import {verifyAdminAccessToken,verifyAdminRefreshToken} from '../utils/verifyToken.js'

const router = express.Router()

// Auth routes

router.post('/signup',registerAdmin);

router.post('/login',loginAdmin);

router.post('/logout',logoutAdmin)

router.post('/refresh-token',verifyAdminRefreshToken,refreshToken)

// Admin profile CRUD

router.get('/profile/:id',verifyAdminAccessToken,loadProfile)

router.post('/update-profile/:id',verifyAdminAccessToken,updateProfile)

//  Admin - Users CRUD

// Create user 

router.post('/add-user',verifyAdminAccessToken,addUser)

// Read users details

router.get('/users-details',verifyAdminAccessToken,loadUsers)

// view specific user details

router.get('/user-details/:id',verifyAdminAccessToken,loadUserDetails)

// Update user details

router.post('/update-user-details/:id',verifyAdminAccessToken,updateUserDetails)

// Delete user

router.delete('/delete-user/:id',verifyAdminAccessToken,deleteUser)

// Admin - Tutor CRUD

// create tutor

router.post('/add-tutor',verifyAdminAccessToken,addTutor)

// Read tutors details

router.get('/tutors-details',verifyAdminAccessToken,loadTutors)

// view specific tutor details

router.get('/tutor-details/:id',verifyAdminAccessToken,loadTutorDetails)

// update tutor details

router.post('/update-tutor-details/:id',verifyAdminAccessToken,updateTutorDetails)

// delete tutor

router.delete('/delete-tutor/:id',verifyAdminAccessToken,deleteTutor)


export default router