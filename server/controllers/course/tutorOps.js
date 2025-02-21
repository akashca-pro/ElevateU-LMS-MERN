import Course from '../../model/course.js'
import Category from '../../model/category.js'

// create a course
export const createCourse = async (req,res) => {
    
    try {
        const tutorId = req.params.id
        const {title, description, category, price, thumbnail} = req.body

        const categoryDetails = await Category.findOne({name : category})
        if (!categoryDetails) return res.status(404).json({ message: "Category not found" });

        const existingCourse = await Course.findOne({ title, tutor: tutorId });
        if (existingCourse) {
            return res.status(400).json({ message: "Course with this title already exists" });
        }

        const newCourse = new Course({
            title , description ,
             category : categoryDetails._id ,
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

        if(course.isPublished) return res.status(409).json({message : 'Course already published'})

        course.isApproved = 'pending'

        await course.save();

        return res.status(200).json({ message: "Course Approve requested , after verifying course will be published" ,course});

    } catch (error) {
        console.error('Error publishing course', error);
        return res.status(500).json({ message: 'Error publishing course', error: error.message });
    }

}