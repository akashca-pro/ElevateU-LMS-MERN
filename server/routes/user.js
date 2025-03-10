import express from 'express'

import {registerUser,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink,
    passportCallback, authFailure ,authLoad
} from '../controllers/user/userAuth.js'

import {loadProfile,updateProfile,deleteAccount
} from '../controllers/user/userOps.js'

import {enrollInCourse, loadEnrolledCourses} from '../controllers/enrolledCourse/userOps.js'

import {verifyAccessToken,verifyRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';

import { updateEmail, verifyEmail} from '../controllers/commonControllers.js';

import passport from 'passport'

import { isBlock } from '../middleware/isBlock.js'

const router =  express.Router();

// Auth routes

router.post('/signup',registerUser)
// router.post('/verify-otp',otpLimiter,verifyOtp)
router.post('/login',loginUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',verifyResetLink)
router.delete('/logout',logoutUser)
router.patch('/refresh-token',verifyRefreshToken('user'),refreshToken)

router.get('/google',passport.authenticate("google-user",{ scope: ["profile", "email"] }))

router.get('/auth-callback',passport.authenticate("google-user",{ session : false }),passportCallback);

router.get('/auth-failure',authFailure)

router.get('/auth-load',verifyAccessToken('user'),authLoad) 

// CRUD routes

router.get('/profile',verifyAccessToken('user'),isBlock('user'),loadProfile)
router.post('/update-email/:id',otpLimiter,verifyAccessToken('user'),updateEmail('user'))
router.post('/verify-email',verifyAccessToken('user'),verifyEmail('user'))
router.post('/update-profile/:id',verifyAccessToken('user'),updateProfile)
router.delete('/delete-account/:id',verifyAccessToken('user'),deleteAccount)

// course enrollment

router.post('/enroll-course',verifyAccessToken('user'),enrollInCourse)
router.get('/enrolled-courses/:id',verifyAccessToken('user'),loadEnrolledCourses)


export default router