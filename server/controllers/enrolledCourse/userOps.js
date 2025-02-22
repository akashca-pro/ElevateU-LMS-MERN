import EnrolledCourse from "../../model/enrolledCourses.js";
import Course from "../../model/course.js";

// enroll course

export const enrollInCourse = async (req,res) => {
    
    try {
        const { userId , courseId } = req.body

        const course = await Course.findOne({_id : courseId , isPublished : true})
        if(!course) return res.status(404).json({message : 'course not found'})
        
        const alreadyEnrolled = await EnrolledCourse.findOne({user : userId})
        if(alreadyEnrolled) return res.status(409).json({message : 'course already enrolled'})
        
        const newEnrollment = new EnrolledCourse({
            user : userId,
            course : courseId
        })

        await newEnrollment.save()

        return res.status(201).json({message : 'course enrolled',newEnrollment})

    } catch (error) {
        console.error('Error enrolling course', error);
        return res.status(500).json({ message: 'Error enrolling course', error: error.message });
    }

}

// load enrolled courses

export const loadEnrolledCourses = async (req,res) => {
    
    try {
        const { userId } = req.body
        const course = await EnrolledCourse.find({user : userId})
        if(course.length === 0 || !course) return res.status(404).json({message : 'course not found'})
            
        return res.status(200).json(course)

    } catch (error) {
        console.error('Error loading enrolled course', error);
        return res.status(500).json({ message: 'Error loading enrolled course', error: error.message });
    }

}