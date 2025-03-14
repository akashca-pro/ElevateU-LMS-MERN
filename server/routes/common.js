import express from 'express'
const router = express.Router()
import {sendOtp, verifyOtp, loadCategories, loadCourses ,
    loadCourseDetails} from '../controllers/commonControllers.js'




router.post('/generate-otp',sendOtp)
router.post('/verify-otp',verifyOtp)

router.get('/load-categories',loadCategories)

router.get('/courses/top-rated',loadCourses('top-rated'))
router.get('/courses/best-sellers',loadCourses('best-selling'))
router.get('/courses/new-releases',loadCourses('new-releases'))
router.get('/courses/trending',loadCourses('trending'))
router.get('/courses/:id',loadCourseDetails)

router.get('/load-notifications',)


export default router