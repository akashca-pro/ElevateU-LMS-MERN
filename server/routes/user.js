import express from 'express'

import {registerUser,verifyOtp,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink,
    passportCallback, authFailure ,authLoad
} from '../controllers/user/userAuth.js'

import {loadProfile,updateProfile,deleteAccount
} from '../controllers/user/userOps.js'

import {enrollInCourse, loadEnrolledCourses} from '../controllers/enrolledCourse/userOps.js'

import {verifyUserAccessToken,verifyUserRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import retryVerify from '../middleware/retryVerify.js';

import { updateEmail, verifyEmail , reSendOtp} from '../controllers/commonControllers.js';

import passport from 'passport'

const router =  express.Router();

// Auth routes

router.post('/signup',registerUser)
router.post('/verify-otp',otpLimiter,verifyOtp)
router.post('/login',retryVerify('user'),loginUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',verifyResetLink)
router.patch('/logout',logoutUser)
router.patch('/refresh-token',verifyUserRefreshToken,refreshToken)

router.get('/google',passport.authenticate("google-user",{ scope: ["profile", "email"] }))

router.get('/auth-callback',passport.authenticate("google-user",{ session : false }),passportCallback);

router.get('/auth-failure',authFailure)

router.get('/auth-load',verifyUserAccessToken,authLoad) 

// CRUD routes

router.get('/profile',verifyUserAccessToken,loadProfile)
router.post('/update-email/:id',otpLimiter,verifyUserAccessToken,updateEmail('user'))
router.post('/verify-email',verifyUserAccessToken,verifyEmail('user'))
router.post('/update-profile/:id',verifyUserAccessToken,updateProfile)
router.delete('/delete-account/:id',verifyUserAccessToken,deleteAccount)

// course enrollment

router.post('/enroll-course',verifyUserAccessToken,enrollInCourse)
router.get('/enrolled-courses/:id',verifyUserAccessToken,loadEnrolledCourses)


export default router