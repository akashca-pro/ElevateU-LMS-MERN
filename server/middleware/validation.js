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
        .isLength({ min : 3 })
        .withMessage('Lesson title is required with atleast 3 character'),

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
        ],
        coupon :[
            body("formData.code")
                .trim()
                .notEmpty().withMessage("Coupon code is required")
                .isLength({ min: 3, max: 20 }).withMessage("Coupon code must be between 3 to 20 characters")
                .matches(/^[A-Z0-9]+$/).withMessage("Coupon code must be uppercase letters and numbers only"),
            
            body("formData.discountType")
                .isIn(["percentage", "fixed"]).withMessage("Discount type must be 'percentage' or 'fixed'"),
        
            body("formData.discountValue")
                .isNumeric().withMessage("Discount value must be a number")
                .isFloat({ gt: 0 }).withMessage("Discount value must be greater than zero"),
        
            body("formData.minPurchaseAmount")
                .optional()
                .isNumeric().withMessage("Minimum purchase amount must be a number")
                .isFloat({ gt: 0 }).withMessage("Minimum purchase amount must be greater than zero"),
        
            body("formData.maxDiscount")
                .optional()
                .isNumeric().withMessage("Max discount must be a number")
                .isFloat({ gt: 0 }).withMessage("Max discount must be greater than zero"),
        
            body("formData.expiryDate")
                .notEmpty().withMessage("Expiry date is required")
                .isISO8601().toDate().withMessage("Invalid date format, use ISO8601 format"),
        
            body("formData.usageLimit")
                .optional()
                .isInt({ gt: 0 }).withMessage("Usage limit must be a positive integer"),
            
            body("formData.status")
                .optional()
                .isBoolean().withMessage("Status must be true or false"),
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