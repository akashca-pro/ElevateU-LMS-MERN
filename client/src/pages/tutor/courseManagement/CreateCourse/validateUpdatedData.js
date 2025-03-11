const validateUpdatedData = (course) => {
    const errors = [];
  
    // Basic course info validation
    if (!course.title?.trim()) errors.push("Course title is required");
    if (!course.description?.trim()) errors.push("Course description is required");
    if (!course.category) errors.push("Category is required");
    if (!course.thumbnail) errors.push("Thumbnail is required");
  
    // Pricing validation
    if (!course.isFree) {
      if (typeof course.price !== 'number' || course.price <= 0) {
        errors.push("Price must be a positive number");
      }
      if (course.discount < 0 || course.discount > 100) {
        errors.push("Discount must be between 0 and 100");
      }
    }
  
    // Content validation
    if (course.modules.length === 0) {
      errors.push("At least one module is required");
    } else {
      course.modules.forEach((module, moduleIndex) => {
        if (!module.title?.trim()) errors.push(`Module ${moduleIndex + 1}: Title is required`);
        if (module.lessons.length === 0) {
          errors.push(`Module ${moduleIndex + 1}: At least one lesson is required`);
        } else {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title?.trim()) {
              errors.push(`Module ${moduleIndex + 1} Lesson ${lessonIndex + 1}: Title is required`);
            }
            if (!lesson.videoUrl?.trim()) {
              errors.push(`Module ${moduleIndex + 1} Lesson ${lessonIndex + 1}: Video URL is required`);
            }
            if (typeof lesson.duration !== 'number' || lesson.duration <= 0) {
              errors.push(`Module ${moduleIndex + 1} Lesson ${lessonIndex + 1}: Duration must be a positive number`);
            }
          });
        }
      });
    }
  
    // Requirements validation
    if (course.requirements.length === 0) {
      errors.push("At least one requirement is required");
    } else {
      course.requirements.forEach((req, index) => {
        if (!req?.trim()) errors.push(`Requirement ${index + 1} cannot be empty`);
      });
    }
  
    // Learning outcomes validation
    if (course.whatYouLearn.length === 0) {
      errors.push("At least one learning outcome is required");
    } else {
      course.whatYouLearn.forEach((outcome, index) => {
        if (!outcome?.trim()) errors.push(`Learning outcome ${index + 1} cannot be empty`);
      });
    }
  
    return errors;
  };

  export default validateUpdatedData