import express from 'express'
const router = express.Router()
import {reSendOtp} from '../controllers/commonControllers.js'

// Resend otp

router.post('/resend-otp',reSendOtp)


export default router