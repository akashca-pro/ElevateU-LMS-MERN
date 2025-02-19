import express from 'express'
import {registerTutor,verifyOtp,loginTutor,logoutTutor,refreshToken} from '../controllers/tutorController.js'
import {verifyTutorAccessToken,verifyTutorRefreshToken} from '../utils/verifyToken.js'
import {otpLimiter} from '../middleware/rateLimiting.js';
import {retryVerifyTutor} from '../middleware/retryVerify.js';

const router = express.Router()


router.post('/signup',registerTutor)

router.post('/verifyotp',otpLimiter,verifyOtp)

router.post('/login',retryVerifyTutor,loginTutor)

router.post('/logout',logoutTutor)

router.post('/refreshtoken',verifyTutorRefreshToken,refreshToken)



export default router