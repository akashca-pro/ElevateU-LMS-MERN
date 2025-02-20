import express from 'express'
import {registerUser,verifyOtp,loginUser,refreshToken,logoutUser,forgotPassword,verifyResetLink,
loadProfile,
} from '../controllers/userController.js'

import {verifyUserAccessToken,verifyUserRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import {retryVerifyUser} from '../middleware/retryVerify.js';

const router =  express.Router();


router.post('/signup',registerUser)

router.post('/verify-otp',otpLimiter,verifyOtp)

router.post('/login',retryVerifyUser,loginUser)

router.post('/forgot-password',otpLimiter,forgotPassword)

router.post('/reset-password',verifyResetLink)

router.post('/logout',logoutUser)

router.post('/refresh-token',verifyUserRefreshToken,refreshToken)


router.get('/profile/:id',verifyUserAccessToken,loadProfile)


export default router