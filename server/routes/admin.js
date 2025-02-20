import express from 'express'
import {loginAdmin,registerAdmin,logoutAdmin,refreshToken,loadProfile,updateProfile,} from '../controllers/adminController.js'
import {verifyAdminAccessToken,verifyAdminRefreshToken} from '../utils/verifyToken.js'

const router = express.Router()

// Auth routes

router.post('/signup',registerAdmin);

router.post('/login',loginAdmin);

router.post('/logout',logoutAdmin)

router.post('/refresh-token',verifyAdminRefreshToken,refreshToken)

// CRUD routes

router.get('/profile/:id',verifyAdminAccessToken,loadProfile)

router.post('/update-profile/:id',verifyAdminAccessToken,updateProfile)


export default router