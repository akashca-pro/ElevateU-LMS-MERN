import express from 'express'
const router = express.Router()
import {sendOtp, verifyOtp, loadCategories, getCourses ,
    loadCourseDetails, loadCourses} from '../controllers/commonControllers.js'




router.post('/generate-otp',sendOtp)
router.post('/verify-otp',verifyOtp)

router.get('/load-categories',loadCategories)

router.get('/courses',loadCourses)
router.get('/courses/top-rated',getCourses('top-rated'))
router.get('/courses/best-sellers',getCourses('best-selling'))
router.get('/courses/new-releases',getCourses('new-releases'))
router.get('/courses/trending',getCourses('trending'))
router.get('/courses/:id',loadCourseDetails)

router.get('/load-notifications',)


export default router