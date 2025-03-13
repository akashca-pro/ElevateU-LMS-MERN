const validateUpdatedData = (course) => {
    const errors = {};
  
    // Basic course info validation
    if (!course.title?.trim()) errors.title = "Course title is required";
    if (!course.description?.trim()) errors.description = "Course description is required";
    if (!course.category) errors.category = "Category is required";
    if (!course.thumbnail) errors.thumbnail = "Thumbnail is required";
  
    // Pricing validation
    if (!course.isFree) {
        if (typeof course.price !== 'number' || course.price <= 0) {
            errors.price = "Price must be a positive number";
        }
        if (course.discount < 0 || course.discount > 100) {
            errors.discount = "Discount must be between 0 and 100";
        }
    }
  
    // Content validation
    if (!course.modules || course.modules.length === 0) {
        errors.modules = "At least one module is required";
    } else {
        errors.modules = [];
        course.modules.forEach((module, moduleIndex) => {
            let moduleErrors = {};
            if (!module.title?.trim()) moduleErrors.title = "Module title is required";
            
            if (!module.lessons || module.lessons.length === 0) {
                moduleErrors.lessons = "At least one lesson is required";
            } else {
                moduleErrors.lessons = [];
                module.lessons.forEach((lesson, lessonIndex) => {
                    let lessonErrors = {};
                    if (!lesson.title?.trim()) lessonErrors.title = "Lesson title is required";
                    if (!lesson.videoUrl?.trim()) lessonErrors.videoUrl = "Lesson video URL is required";
                    if (typeof lesson.duration !== 'number' || lesson.duration <= 0) {
                        lessonErrors.duration = "Lesson duration must be a positive number";
                    }

                    if (Object.keys(lessonErrors).length > 0) {
                        moduleErrors.lessons[lessonIndex] = lessonErrors;
                    }
                });
            }

            if (Object.keys(moduleErrors).length > 0) {
                errors.modules[moduleIndex] = moduleErrors;
            }
        });
    }
  
    // Requirements validation
    if (!course.requirements || course.requirements.length === 0) {
        errors.requirements = "At least one requirement is required";
    } else {
        errors.requirements = [];
        course.requirements.forEach((req, index) => {
            if (!req?.trim()) errors.requirements[index] = "Requirement cannot be empty";
        });
    }
  
    // Learning outcomes validation
    if (!course.whatYouLearn || course.whatYouLearn.length === 0) {
        errors.whatYouLearn = "At least one learning outcome is required";
    } else {
        errors.whatYouLearn = [];
        course.whatYouLearn.forEach((outcome, index) => {
            if (!outcome?.trim()) errors.whatYouLearn[index] = "Learning outcome cannot be empty";
        });
    }
  
    return errors;
};

export default validateUpdatedData;