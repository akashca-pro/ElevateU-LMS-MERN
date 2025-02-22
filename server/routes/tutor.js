import express from 'express'

import {registerTutor, verifyOtp, loginTutor, forgotPassword, verifyResetLink, logoutTutor, refreshToken 
} from '../controllers/tutor/tutorAuth.js'

import {loadProfile,updateProfile,deleteAccount,requestVerification
} from '../controllers/tutor/tutorOps.js'

import {verifyTutorAccessToken, verifyTutorRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import retryVerify from '../middleware/retryVerify.js';

import { updateEmail, verifyEmail } from '../controllers/commonControllers.js';

import {createCourse, updateCourse, publishCourse, deleteCourse, loadCourses, courseDetails

} from '../controllers/course/tutorOps.js'

const router = express.Router()

// Auth routes

router.post('/signup',registerTutor)
router.post('/verify-otp',otpLimiter,verifyOtp)
router.post('/login',retryVerify('tutor'),loginTutor)
router.post('/forgot-password',otpLimiter,forgotPassword)
router.post('/reset-password',verifyResetLink)
router.patch('/logout',logoutTutor)
router.patch('/refresh-token',verifyTutorRefreshToken,refreshToken)

// CRUD routes

router.get('/profile/:id',verifyTutorAccessToken,loadProfile)
router.post('/update-email/:id',otpLimiter,verifyTutorAccessToken,updateEmail('tutor'))
router.post('/verify-email',verifyTutorAccessToken,verifyEmail('tutor'))
router.post('/update-profile/:id',verifyTutorAccessToken,updateProfile)
router.delete('/delete-account/:id',verifyTutorAccessToken,deleteAccount)

// request verification from admin

router.patch('/request-verification/:id',verifyTutorAccessToken,requestVerification)

// course manage

router.post('/create-course/:id',verifyTutorAccessToken,createCourse)
router.get('/courses',verifyTutorAccessToken,loadCourses)
router.get('/view-course/:id',verifyTutorAccessToken,courseDetails)
router.post('/update-course/:id',verifyTutorAccessToken,updateCourse)
router.post('/publish-course/:id',verifyTutorAccessToken,publishCourse)
router.delete('/delete-course/:id',verifyTutorAccessToken,deleteCourse)


export default router