import Category from "../../model/category.js";
import Course from "../../model/course.js";

// view all courses

export const loadCourses = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const { search } = req.query
        const skip = (page - 1) * limit

        const searchQuery = {
             title : {$regex : search , $options : "i"}
        }

        const allCourses = await Course.find(search ? searchQuery : {})
        .skip(skip)
        .limit(limit)

        if(!allCourses || allCourses.length === 0) return res.status(404).json({message : 'course not found'})
        
        return res.status(200).json(allCourses)

    } catch (error) {
        console.error('Error loading all courses', error);
        return res.status(500).json({ message: 'Error loading all courses', error: error.message });
    }

}

// view pending requests

export const loadPendingRequest = async (req,res) => {
    
    try {
        const pendingRequest = await Course.find({isApproved : "pending"})
        if(pendingRequest.length === 0) return res.status(404).json({message : 'no pending request'});

        return res.status(200).json(pendingRequest)

    } catch (error) {
        console.error('Error loading pending request', error);
        return res.status(500).json({ message: 'Error loading pending request', error: error.message });
    }

}

// approve course publish

export const approvePublish = async (req,res) => {
    
    try {
        const {tutorId} = req.body
        const course_Id = req.params.id

        const course = await Course.findOne({_id : course_Id , tutor : tutorId})
        if(!course) return res.status(404).json({message : 'course not found or invalid tutor '})

        if(course.isApproved === "approved" || course.isApproved === "rejected") 
            return res.status(409).json({message : 'already approved or rejected'});

        if(course.isApproved !== "pending") 
            return res.status(404).json({message : 'tutor not initialted publish request'}); 

        course.isApproved = "approved"
        course.isPublished = true
        course.rejectReason = undefined

        await course.save()

        return res.status(200).json({message : 'course approved',course})

    } catch (error) {
        console.error('Error approving course', error);
        return res.status(500).json({ message: 'Error approving course', error: error.message });
    }

}

// reject course publish

export const rejectPublish = async (req,res) =>{
    
    try {
        const {tutorId, reason} = req.body
        const course_Id = req.params.id

        const course = await Course.findOne({_id : course_Id , tutor : tutorId})
        if(!course) return res.status(404).json({message : 'course not found or invalid tutor '})

        if(course.isApproved === "approved" || course.isApproved === "rejected") 
            return res.status(409).json({message : 'already approved or rejected'});

        if(course.isApproved !== "pending") 
            return res.status(404).json({message : 'tutor not initialted publish request'}); 

        course.isApproved = "rejected"
        course.rejectReason = reason
    
        await course.save()

        return res.status(200).json({message : 'course rejected',course})

    } catch (error) {
        console.error('Error rejecting course', error);
        return res.status(500).json({ message: 'Error rejecting course', error: error.message });
    }

}

// delete course 

export const deleteCourse = async (req,res) => {
    
    try {
        const course_Id = req.params.id
        const {tutorId} = req.body

        const course = await Course.findOne({_id : course_Id , tutor : tutorId})
        if(!course) return res.status(404).json({message : 'course not found'})
        
        await course.findOneAndDelete({_id : course_Id , tutor : tutorId})

        return res.status(200).json({message : 'course deleted successfully'});

    } catch (error) {
        console.error('Error deleting course', error);
        return res.status(500).json({ message: 'Error deleting course', error: error.message });
    }

}

// Assign course to category

export const assignCategory = async (req,res) => {
    
    try {
        const { courseId, categoryId } = req.body

        const course = await Course.findById(courseId)
        if(!course) return res.status(404).json({message : 'course not found'})

        const category = await Category.findById(categoryId)
        if(!category) return res.status(404).json({message : 'category not found'})

        course.category = categoryId

        await course.save()

        return res.status(200).json({message  : 'assigned course to the category'})

    } catch (error) {
        console.error('Error assigning category', error);
        return res.status(500).json({ message: 'Error assigning category', error: error.message });
    }

}