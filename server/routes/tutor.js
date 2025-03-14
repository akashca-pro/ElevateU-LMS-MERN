import express from 'express'

import {registerTutor, loginTutor, forgotPassword, verifyResetLink, logoutTutor, refreshToken ,
    passportCallback,authFailure,authLoad, isTutorVerified
} from '../controllers/tutor/tutorAuth.js'

import {loadProfile,updateProfile,deleteAccount,requestVerification
} from '../controllers/tutor/tutorOps.js'

import {verifyAccessToken, verifyRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';

import { updateEmail, verifyEmail, isBlock} from '../controllers/commonControllers.js';

import {createCourse, updateCourse, requestPublish, deleteCourse, loadCourses, courseDetails,
courseTitleExist,
} from '../controllers/course/tutorOps.js'
import passport from 'passport';
import { loadNotifications, readNotifications } from '../controllers/notificationController.js';
import { isBlocked } from '../middleware/isBlocked.js';

const router = express.Router()

// Auth routes

router.post('/signup',registerTutor)
router.post('/login',loginTutor)
router.post('/forgot-password',otpLimiter,forgotPassword)
router.post('/reset-password',verifyResetLink)
router.delete('/logout',logoutTutor)
router.patch('/refresh-token',verifyRefreshToken('tutor'),refreshToken)

router.get('/google',passport.authenticate('google-tutor',{ scope: ["profile", "email"] }))


router.get('/auth-callback',passport.authenticate('google-tutor',{ session : false , 
    failureRedirect : '/auth-failure' }),passportCallback);

router.get('/auth-failure',authFailure)

router.get('/auth-load',verifyAccessToken('tutor'),authLoad)

//Is Verified
router.get('/is-verified',verifyAccessToken('tutor'),isTutorVerified)

//Is Blocked

router.get('/isblocked',verifyAccessToken('tutor'),isBlock('tutor'))

// CRUD routes

router.get('/profile',verifyAccessToken('tutor'),loadProfile)
router.post('/update-email/:id',otpLimiter,verifyAccessToken('tutor'),updateEmail('tutor'))
router.post('/verify-email',verifyAccessToken('tutor'),verifyEmail('tutor'))
router.post('/update-profile',verifyAccessToken('tutor'),updateProfile)
router.delete('/delete-account/:id',verifyAccessToken('tutor'),deleteAccount)

// request verification from admin

router.patch('/request-verification/:id',verifyAccessToken('tutor'),requestVerification)

// course manage

router.post('/create-course',verifyAccessToken('tutor'),createCourse)
router.get('/courses',verifyAccessToken('tutor'),loadCourses)
router.get('/view-course/:id',verifyAccessToken('tutor'),courseDetails)
router.post('/update-course',verifyAccessToken('tutor'),updateCourse)
router.post('/publish-course',verifyAccessToken('tutor'),requestPublish)
router.delete('/delete-course/:id',verifyAccessToken('tutor'),deleteCourse)
router.get('/check-title/:title',verifyAccessToken('tutor'),courseTitleExist)

// notification

router.get('/load-notifications',verifyAccessToken('tutor'),loadNotifications('tutor'))
router.post('/read-notifications',verifyAccessToken('tutor'),readNotifications)


export default router