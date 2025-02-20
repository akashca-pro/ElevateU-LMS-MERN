import express from 'express'
import {registerUser,verifyOtp,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink,
loadProfile,updateProfile
} from '../controllers/userController.js'

import {verifyUserAccessToken,verifyUserRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import retryVerify from '../middleware/retryVerify.js';

import { updateEmail, verifyEmail } from '../controllers/commonControllers.js';

const router =  express.Router();

// Auth routes

router.post('/signup',registerUser)

router.post('/verify-otp',otpLimiter,verifyOtp)

router.post('/login',retryVerify('user'),loginUser)

router.post('/forgot-password',otpLimiter,forgotPassword)

router.post('/reset-password',verifyResetLink)

router.post('/logout',logoutUser)

router.post('/refresh-token',verifyUserRefreshToken,refreshToken)

// CRUD routes

router.get('/profile/:id',verifyUserAccessToken,loadProfile)

router.post('/update-email/:id',otpLimiter,verifyUserAccessToken,updateEmail('user'))

router.post('/verify-email',verifyUserAccessToken,verifyEmail('user'))

router.post('/update-profile/:id',verifyUserAccessToken,updateProfile)

export default router