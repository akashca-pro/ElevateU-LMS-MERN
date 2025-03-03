import express from 'express'

import {registerAdmin, loginAdmin, logoutAdmin, refreshToken, loadProfile, updateProfile
} from '../controllers/admin/adminAuth.js'   // Admin Auth

import {addUser,loadUsers,loadUserDetails,updateUserDetails,deleteUser    
} from '../controllers/admin/adminUserOps.js' // Admin - User CRUD

import {addTutor,loadTutors,loadTutorDetails,updateTutorDetails,deleteTutor,
loadRequests,approveOrRejectrequest
} from '../controllers/admin/adminTutorOps.js' // Admin - Tutor CRUD

import {loadCategory, addCategory, updateCategory, deleteCategory , loadCategoryDetails
} from '../controllers/admin/adminCategoryOps.js' // Admin - category CRUD

import {loadPendingRequest, approvePublish, rejectPublish, deleteCourse, loadCourses, assignCategory
} from '../controllers/course/adminOps.js' // Admin manage course approval and course Manage

import {verifyAccessToken,verifyRefreshToken} from '../utils/verifyToken.js'

const router = express.Router()

// Auth routes

router.post('/signup',registerAdmin);
router.post('/login',loginAdmin);
router.delete('/logout',logoutAdmin)
router.patch('/refresh-token',verifyRefreshToken('admin'),refreshToken)

// Admin profile CRUD

router.get('/profile',verifyAccessToken('admin'),loadProfile)
router.post('/update-profile',verifyAccessToken('admin'),updateProfile)

//  Admin - Users CRUD

router.post('/add-user',verifyAccessToken('admin'),addUser)
router.get('/users-details',verifyAccessToken('admin'),loadUsers)
router.get('/user-details/:id',verifyAccessToken('admin'),loadUserDetails)
router.post('/update-user-details/:id',verifyAccessToken('admin'),updateUserDetails)
router.delete('/delete-user/:id',verifyAccessToken('admin'),deleteUser)

// Admin - Tutor CRUD

router.post('/add-tutor',verifyAccessToken('admin'),addTutor)
router.get('/tutors-details',verifyAccessToken('admin'),loadTutors)
router.get('/tutor-details/:id',verifyAccessToken('admin'),loadTutorDetails)
router.post('/update-tutor-details/:id',verifyAccessToken('admin'),updateTutorDetails)
router.delete('/delete-tutor/:id',verifyAccessToken('admin'),deleteTutor)

// notification from tutor verification request

router.get('/verification-request',verifyAccessToken('admin'),loadRequests)
router.post('/control-verification',verifyAccessToken('admin'),approveOrRejectrequest)


// category CRUD

router.get('/categories',verifyAccessToken('admin'),loadCategory)
router.get('/category',verifyAccessToken('admin'),loadCategoryDetails)
router.post('/add-category',verifyAccessToken('admin'),addCategory)
router.post('/update-category',verifyAccessToken('admin'),updateCategory)
router.delete('/delete-category/:id',verifyAccessToken('admin'),deleteCategory)

//course publish request manage

router.get('/pending-request',verifyAccessToken('admin'),loadPendingRequest)
router.post('/course-approve/:id',verifyAccessToken('admin'),approvePublish)
router.post('/course-reject/:id',verifyAccessToken('admin'),rejectPublish)


// course manage

router.get('/view-courses',verifyAccessToken('admin'),loadCourses)
router.post('/assign-category',verifyAccessToken('admin'),assignCategory)
router.delete('/delete-course/:id',verifyAccessToken('admin'),deleteCourse)


export default router