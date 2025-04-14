import Course from "../../model/course.js";
import Order from "../../model/order.js";
import Transaction from "../../model/transaction.js";
import Tutor from "../../model/tutor.js";
import User from "../../model/user.js";
import Wallet from "../../model/wallet.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js"

// best selling courses

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

         if(!courses || courses.length === 0)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

         return ResponseHandler.success(res, STRING_CONSTANTS.LOAD_BEST_SELLING_COURSE_SUCCESS, HttpStatus.OK, courses)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// best selling category

export const bestSellingCategory = async (req,res) => {
    
    try {
        const {fromDate, toDate} = req.query;

        const matchDate = {
            paymentStatus : 'success'
        }

        if(fromDate && toDate){
            matchDate.createdAt = { $gte : new Date(fromDate), $lte : new Date(toDate) }
        }

        const categories = await Order.aggregate([
            { $match : matchDate },
            { $group : { _id : '$categoryId', totalSales : { $sum : 1 } } },
            { $sort : { totalSales : -1 } },
            { $limit : 10 },
            {
                $lookup : {
                    from : 'categories',
                    localField : '_id',
                    foreignField : '_id',
                    as : 'categories'
                }
            },
            { $unwind : '$categories' },
            { $project : {
                _id : 1,
                totalSales : 1,
                'title' : '$categories.name',
                'thumbnail' : '$categories.icon'
            } }
            
        ])
        
        if(!categories || categories.length === 0)
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);

        return ResponseHandler.success(res, STRING_CONSTANTS.LOAD_BEST_SELLING_CATEGORY_SUCCESS, HttpStatus.OK, categories)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// dashboardDetails

export const dashboardDetails = async (req,res) => {
    
    try {
        const adminId = req.admin.id
        const totalStudents = await User.countDocuments();
        const totalTutors = await Tutor.countDocuments();
        const totalCourses = await Course.countDocuments();

        const { totalEarnings } = await Wallet.findOne({ userId : adminId, userModel : 'Admin' })
        .select('-_id totalEarnings').lean()

        ResponseHandler.success(res,STRING_CONSTANTS.LOAD_DASHBOARD_DETAILS_SUCCESS,HttpStatus.OK,{
            totalStudents,
            totalTutors,
            totalEarnings,
            totalCourses
        })

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

// Revenue data for chart analysis

export const revenueChartAnalysis = async (req,res) => {
    
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const matchFilter = { 
            type: 'course_purchase',
        }

        if(year){
            matchFilter.createdAt =  {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
              }
        }

        const revenueData = await Transaction.aggregate([
            { $match :  matchFilter },
            {
                $group: {
                  _id: { month: { $month: "$createdAt" } },
                  totalRevenue: { $sum: "$amount.adminPayout" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ])

        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const found = revenueData.find(r => r._id.month === month);
            return {
              month: new Date(0, i).toLocaleString('default', { month: 'short' }),
              income: found?.totalRevenue || 0,
              profit: found?.totalRevenue || 0 
            };
          });

        return ResponseHandler.success(res, STRING_CONSTANTS.LOAD_CHART_DATA_SUCCESS,HttpStatus.OK,monthlyRevenue)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}