import express from 'express'
import {loginAdmin,registerAdmin,logoutAdmin,refreshToken} from '../controllers/adminController.js'
import {verifyAdminAccessToken,verifyAdminRefreshToken} from '../utils/verifyToken.js'

const router = express.Router()

router.post('/signup',registerAdmin);

router.post('/login',loginAdmin);

router.post('/logout',logoutAdmin)

router.post('/refresh-token',verifyAdminRefreshToken,refreshToken)




export default router