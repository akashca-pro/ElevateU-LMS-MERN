import express from 'express'
const router = express.Router()
import {sendOtp, verifyOtp, loadCategories} from '../controllers/commonControllers.js'


// Resend otp

router.post('/generate-otp',sendOtp)
router.post('/verify-otp',verifyOtp)
router.get('/load-categories',loadCategories)


export default router