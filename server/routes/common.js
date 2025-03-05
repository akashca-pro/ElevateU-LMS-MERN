import express from 'express'
const router = express.Router()
import {sendOtp, verifyOtp} from '../controllers/commonControllers.js'


// Resend otp

router.post('/generate-otp',sendOtp)
router.post('/verify-otp',verifyOtp)

export default router