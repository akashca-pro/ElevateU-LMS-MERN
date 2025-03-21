import AppliedCoupon from "../../model/AppliedCoupons.js";
import Course from "../../model/course.js";
import Order from "../../model/order.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

export const createOrder = async (req,res) => {
    
    try {
        const { courseId, userData, appliedCoupon } = req.body

        if(!courseId || !userData )
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const course = await Course.findById(courseId);

        if(!course) 
            return ResponseHandler.error(res, 'Course not found', HttpStatus.NOT_FOUND);
        
        const originalPrice = course.price;
        const discount = course.discount;
        let finalPrice;

        if(appliedCoupon){

            const coupon = await AppliedCoupon.findOne({ userId : userData._id , couponCode : appliedCoupon });
            if(!coupon)
                return ResponseHandler.error(res, 'Coupon not found',HttpStatus.NOT_FOUND);

            finalPrice = coupon.finalAmount;

        }else{
            finalPrice = originalPrice * (discount/100);
        }

        



    } catch (error) {
        
    }

}