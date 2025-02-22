import express from 'express'

import {registerUser,verifyOtp,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink
} from '../controllers/user/userAuth.js'

import {loadProfile,updateProfile,deleteAccount
} from '../controllers/user/userOps.js'

import {enrollInCourse, loadEnrolledCourses} from '../controllers/enrolledCourse/userOps.js'

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
router.delete('/delete-account/:id',verifyUserAccessToken,deleteAccount)

// course enrollment

router.post('/enroll-course',verifyUserAccessToken,enrollInCourse)
router.get('/enrolled-courses',verifyUserAccessToken,loadEnrolledCourses)


export default router