import express from 'express'

import {registerUser,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink,
    passportCallback, authFailure ,authLoad
} from '../controllers/user/userAuth.js'

import {loadProfile,updateProfile,deleteAccount
} from '../controllers/user/userOps.js'

import {enrollInCourse, loadEnrolledCourses} from '../controllers/enrolledCourse/userOps.js'

import {verifyAccessToken,verifyRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import { validateForm } from '../middleware/validation.js'

import { updateEmail, verifyEmail , isBlock} from '../controllers/commonControllers.js';

import passport from 'passport'
import { loadNotifications, readNotifications } from '../controllers/notificationController.js'
import { applyCoupon, fetchCurrentAppliedCoupon, getPricing, removeAppliedCoupon } from '../controllers/course/userOps.js'
import { createOrder, verifyPayment } from '../controllers/order/userOrderOps.js'


const router =  express.Router();

// Auth routes

router.post('/signup',validateForm('user','register'),registerUser)
router.post('/login',validateForm('user','login'),loginUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',verifyResetLink)
router.delete('/logout',logoutUser)
router.patch('/refresh-token',verifyRefreshToken('user'),refreshToken)

router.get('/google',passport.authenticate("google-user",{ scope: ["profile", "email"] }))

router.get('/auth-callback',passport.authenticate("google-user",{ session : false }),passportCallback);

router.get('/auth-failure',authFailure)

router.get('/auth-load',verifyAccessToken('user'),authLoad)

//isBlock

router.get('/isblocked',verifyAccessToken('user'),isBlock('user'))

// CRUD routes

router.get('/profile',verifyAccessToken('user'),loadProfile)
router.post('/update-email/:id',otpLimiter,verifyAccessToken('user'),updateEmail('user'))
router.post('/verify-email',verifyAccessToken('user'),verifyEmail('user'))
router.post('/update-profile/:id',validateForm('user','profile'),verifyAccessToken('user'),updateProfile)
router.delete('/delete-account/:id',verifyAccessToken('user'),deleteAccount)

// course enrollment

router.post('/enroll-course',verifyAccessToken('user'),enrollInCourse)
router.get('/enrolled-courses',verifyAccessToken('user'),loadEnrolledCourses)

// notification

router.get('/load-notifications',verifyAccessToken('user'),loadNotifications('user'))
router.post('/read-notifications',verifyAccessToken('user'),readNotifications)

//pricing

router.get('/get-pricing/:id',verifyAccessToken('user'),getPricing)
router.get('/get-applied-coupon/:id',verifyAccessToken('user'),fetchCurrentAppliedCoupon)
router.post('/apply-coupon',verifyAccessToken('user'),applyCoupon)
router.delete('/remove-applied-coupon/:id',verifyAccessToken('user'),removeAppliedCoupon)

// order 

router.post('/create-order',verifyAccessToken('user'),createOrder)
router.post('/verify-payment',verifyAccessToken('user'),verifyPayment)

export default router