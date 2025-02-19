import express from 'express'
import {registerUser,verifyOtp,loginUser,refreshToken,logoutUser} from '../controllers/userController.js'
import {verifyUserAccessToken,verifyUserRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import {retryVerifyUser} from '../middleware/retryVerify.js';

const router =  express.Router();


router.post('/signup',registerUser)

router.post('/verifyotp',otpLimiter,verifyOtp)

router.post('/login',retryVerifyUser,loginUser)

router.post('/logout',logoutUser)

router.post('/refreshToken',verifyUserRefreshToken,refreshToken)


export default router