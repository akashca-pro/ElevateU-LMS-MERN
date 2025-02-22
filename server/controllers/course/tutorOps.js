import Course from '../../model/course.js'
import Tutor from '../../model/tutor.js'

// create a course
export const createCourse = async (req,res) => {
    
    try {
        const tutorId = req.params.id
        const {title, description, price, thumbnail} = req.body

        const tutorCheck = await Tutor.findById(tutorId)
        if(!tutorCheck) return res.status(404).json({message : 'tutor not found'})

        const existingCourse = await Course.findOne({ title, tutor: tutorId });
        if (existingCourse) {
            return res.status(400).json({ message: "Course with this title already exists" });
        }

        const newCourse = new Course({
            title , description ,
            tutor : tutorId
            , price , thumbnail
        })

        await newCourse.save()

        res.status(201).json({ message: "Course created successfully", newCourse });

    } catch (error) {
        console.log('Error creating course');
        return res.status(500).json({ message: 'Error creating  course', error: error.message });
    }

}

// view all uploaded courses

export const loadCourses = async (req,res) => {
    
    try {
        const {tutorId} = req.body
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {title : {$regex : search , $options : 'i'} , tutor : tutorId}

        const course = await Course.find(search ? searchQuery : {tutor : tutorId})
        .skip(skip)
        .limit(limit)

        if(!course) return res.status(404).json({message : 'course not found'})

        return res.status(200).json(course)
            
    } catch (error) {
        console.log('Error loading courses');
        return res.status(500).json({ message: 'Error loading  courses', error: error.message });
    }

}

// view specific course

export const courseDetails = async (req,res) => {
    
    try {
        const course_Id = req.params.id
        const {tutorId} = req.body

        const courseDetails = await Course.findOne({_id : course_Id , tutor : tutorId})
        if(!courseDetails) return res.status(404).json({message : 'course not found'})

        return res.status(200).json(courseDetails)

    } catch (error) {
        console.log('Error loading course details');
        return res.status(500).json({ message: 'Error loading  course details', error: error.message });
    }

}

// update course

export const updateCourse = async (req, res) => {
    try {
      const { title, description, price, thumbnail, tutorId } = req.body;
      const course_Id = req.params.id;

      const course = await Course.findOne({_id : course_Id , tutor : tutorId});
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const existingCourse = await Course.findOne({ title, tutor: tutorId, _id: { $ne: course_Id } });
      if (existingCourse) {
        return res.status(409).json({ message: 'Another course with the same title and tutor already exists' });
      }
  
      course.title = title;
      course.description = description;
      course.price = price;
      course.thumbnail = thumbnail;
  
      await course.save();
  
      return res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
      console.error('Error updating course', error);
      return res.status(500).json({ message: 'Error updating course', error: error.message });
    }
};
  
// publish course

export const publishCourse = async (req,res) => {
    
    try {
        const course_Id = req.params.id
        const {tutorId} = req.body
        const course = await Course.findOne({_id : course_Id , tutor : tutorId})

        if (!course) return res.status(403).json({ message: 'Not authorized to publish this course' });

        if(course.isPublished || course.isApproved === "approved") 
            return res.status(409).json({message : 'Course already published'});

        course.isApproved = 'pending'

        await course.save();

        return res.status(200).json({ message: "Course Approve requested , after verifying course will be published"});

    } catch (error) {
        console.error('Error publishing course', error);
        return res.status(500).json({ message: 'Error publishing course', error: error.message });
    }

}

// delete course 

export const deleteCourse = async (req,res) => {
    
    try {
        const course_Id = req.params.id
        const {tutorId} = req.body

        const course = await Course.findOne({_id : course_Id , tutor : tutorId})

        if(!course) return res.status(404).json({message : 'course not found'})
        
        await Course.findOneAndDelete({_id : course_Id , tutor : tutorId})

        return res.status(200).json({message : 'course deleted successfully'})

    } catch (error) {
        console.error('Error deleting course', error);
        return res.status(500).json({ message: 'Error deleting course', error: error.message });
    }

}
