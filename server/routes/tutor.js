import express from 'express'
import {registerTutor,verifyOtp,loginTutor,logoutTutor,refreshToken,forgotPassword,verifyResetLink} from '../controllers/tutorController.js'
import {verifyTutorAccessToken,verifyTutorRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import {retryVerifyTutor} from '../middleware/retryVerify.js';

const router = express.Router()


router.post('/signup',registerTutor)

router.post('/verify-otp',otpLimiter,verifyOtp)

router.post('/login',retryVerifyTutor,loginTutor)

router.post('/forgot-password',otpLimiter,forgotPassword)

router.post('/reset-password',verifyResetLink)

router.post('/logout',logoutTutor)

router.post('/refresh-token',verifyTutorRefreshToken,refreshToken)



export default router