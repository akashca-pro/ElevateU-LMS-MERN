import Order from "../../model/order.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js"

export const bestSellingCourse = async (req,res) => {
    
    try {
        const {fromDate, toDate} = req.query;

        const matchStage = {
            paymentStatus: 'success',
          };
          
          if (fromDate && toDate) {
            matchStage.createdAt = {
              $gte: new Date(fromDate),
              $lte: new Date(toDate),
            };
          }

        const courses = await Order.aggregate([ 
            { $match: matchStage },
            { $group : { _id : '$courseId' , totalSales : { $sum : 1 } } },
            { $sort : { totalSales : -1 } },
            { $limit : 10 },
            {
                $lookup : {
                    from : 'courses',
                    localField : '_id',
                    foreignField : '_id',
                    as : 'courses'
                }
            },
            { $unwind : '$courses' },
            {
                $lookup: {
                  from: 'tutors', 
                  localField: 'courses.tutor',
                  foreignField: '_id',
                  as: 'tutor'
                }
            },
            {
                $unwind : '$tutor'
            },
            {
                $project: {
                  _id: 1,
                  totalSales: 1,
            
                  // Course specific fields
                  'courseId': '$courses._id',
                  'title': '$courses.title',
                  'tutorId': '$courses.tutor',
                  'category': '$courses.category',
                  'thumbnail': '$courses.thumbnail',
                  'description': '$courses.description',
                  'createdAt': '$courses.createdAt',
                  'price': '$courses.price',
                  'isFree': '$courses.isFree',
                  'level': '$courses.level',
            
                  // Tutor specific fields 
                  'tutorName': '$tutor.firstName',
                  'tutorEmail': '$tutor.email',
                  'tutorImage': '$tutor.profileImage'
                }
              }
         ])


         return ResponseHandler.success(res, STRING_CONSTANTS.LOAD_BEST_SELLING_COURSE_SUCCESS, HttpStatus.OK, courses)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}