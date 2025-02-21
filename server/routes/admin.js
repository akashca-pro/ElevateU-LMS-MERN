import express from 'express'

import {registerAdmin, loginAdmin, logoutAdmin, refreshToken, loadProfile, updateProfile
} from '../controllers/admin/adminAuth.js'   // Admin Auth

import {addUser,loadUsers,loadUserDetails,updateUserDetails,deleteUser    
} from '../controllers/admin/adminUserOps.js' // Admin - User CRUD

import {addTutor,loadTutors,loadTutorDetails,updateTutorDetails,deleteTutor,
loadRequests,approveRequest,rejectRequest
} from '../controllers/admin/adminTutorOps.js' // Admin - Tutor CRUD

import {loadCategory,addCategory,updateCategory,deleteCategory} from '../controllers/admin/adminCategoryOps.js'

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

router.post('/add-user',verifyAdminAccessToken,addUser)
router.get('/users-details',verifyAdminAccessToken,loadUsers)
router.get('/user-details/:id',verifyAdminAccessToken,loadUserDetails)
router.post('/update-user-details/:id',verifyAdminAccessToken,updateUserDetails)
router.delete('/delete-user/:id',verifyAdminAccessToken,deleteUser)

// Admin - Tutor CRUD

router.post('/add-tutor',verifyAdminAccessToken,addTutor)
router.get('/tutors-details',verifyAdminAccessToken,loadTutors)
router.get('/tutor-details/:id',verifyAdminAccessToken,loadTutorDetails)
router.post('/update-tutor-details/:id',verifyAdminAccessToken,updateTutorDetails)
router.delete('/delete-tutor/:id',verifyAdminAccessToken,deleteTutor)

// notification from tutor verification request

router.get('/verification-request',verifyAdminAccessToken,loadRequests)
router.post('/approve-verification/:id',verifyAdminAccessToken,approveRequest)
router.post('/reject-verification/:id',verifyAdminAccessToken,rejectRequest)

// category CRUD

router.get('/categories',verifyAdminAccessToken,loadCategory)
router.post('/add-category',verifyAdminAccessToken,addCategory)
router.post('/update-category/:id',verifyAdminAccessToken,updateCategory)
router.delete('/delete-category/:id',verifyAdminAccessToken,deleteCategory)



export default router