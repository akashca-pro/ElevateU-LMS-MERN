import { body, validationResult } from 'express-validator'

const commonValidations = {

        register : [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min : 6 })
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
        .withMessage('Password must include at least one number and one special character'),
        body('firstName').isLength({ min : 3 }),
        ],
        
        login : [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min : 6 })
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
        .withMessage('Password must include at least one number and one special character'),
        ],

        profile : [
        body('lastName').isLength({ min : 3 }).withMessage('Last name required atleast 3 characters'),
        ]
}

const roleValidations = {
    user : {
        login : [
            ...commonValidations.login
        ],
        register : [
            ...commonValidations.register
        ],
        profile : [
            ...commonValidations.profile,
            body('phone').isLength({ min : 10 }).withMessage('Invalid phone number'),
            body('dob').notEmpty().withMessage('Date of birth is required'),
            body('bio').notEmpty().withMessage('Bio is required')
        ]
    },
    tutor : {
        login : [
            ...commonValidations.login
        ],
        register : [
            ...commonValidations.register
        ],
        profile : [
            ...commonValidations.profile,
            body('phone').isLength({ min : 10 }).withMessage('Invalid phone number'),
            body('dob').notEmpty().withMessage('Date of birth is required'),
            body('bio').notEmpty().withMessage('Bio is required'),
            body('expertise').notEmpty().withMessage('Expertise is required'),
            body('experience').notEmpty().withMessage('Experience is required'),
        ],
        course : [
        body('courseDetails.title')
        .trim()
        .isLength({ min : 5 })
        .withMessage('Course title is required'),

        body('courseDetails.description')
        .trim()
        .isLength({ min : 10 })
        .withMessage('Course description is required of atleast 10 characters'),

        body('courseDetails.category')
        .notEmpty()
        .withMessage('Course category is required'),

        body('courseDetails.isFree')
        .isBoolean()
        .withMessage('isFree must be a boolean'),

        body('courseDetails.whatYouLearn')
        .isArray({ min : 1 })
        .withMessage('What you learn (description) required at least one'),

        body('courseDetails.price')
        .custom((value,{ req })=>{
            if(!req.body.courseDetails.isFree && (typeof value !== 'number' || value <= 0 )){
                throw new Error('Price is required and must be greater than 0 if course is not free')
            }
            return true
        }),

        body('courseDetails.thumbnail')
        .notEmpty()
        .withMessage('Course thumbnail is required'),

        body('courseDetails.modules')
        .isArray({ min : 1 })
        .withMessage('Atleast one module is required'),

        body('courseDetails.modules.*.title')
        .trim()
        .isLength({ min : 5 })
        .withMessage('Module title is required with atleast 5 character'),

        body('courseDetails.modules.*.lessons')
        .isArray({ min : 1 })
        .withMessage('Atleast one lesson is required'),

        body('courseDetails.modules.*.lessons.*.title')
        .trim()
        .isLength({ min : 5 })
        .withMessage('Lesson title is required with atleast 5 character'),

        body('courseDetails.modules.*.lessons.*.videoUrl')
        .trim()
        .notEmpty()
        .withMessage('Video is required of each lesson')

        ]
    },
    admin : {
        login : [
            ...commonValidations.login
        ],
        register : [
            ...commonValidations.register
        ],
        profile : [
            ...commonValidations.profile,
            body('email').isEmail().withMessage('Invalid email format'),
        ]
    }
}

export const validateForm = (role, formType) => async(req,res,next) =>{

   await Promise.all(roleValidations[role][formType].map(validation=> validation.run(req)));

   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  next();

}