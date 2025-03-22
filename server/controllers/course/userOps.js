import AppliedCoupon from "../../model/AppliedCoupons.js";
import Coupon from "../../model/coupon.js";
import Course from "../../model/course.js"
import Order from "../../model/order.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

const calculateDiscount = (coupon,total) => {
    let discount;
    if (coupon.discountType === 'percentage') {
       
        const calculatedDiscount = total * (coupon.discountValue / 100);
        
        discount = coupon.maxDiscount > 0 ? Math.min(calculatedDiscount, coupon.maxDiscount) : calculatedDiscount;
    } else {
        discount = Math.min(coupon.discountValue, total);
    }

    return parseFloat(discount.toFixed(2));
}

export const getPricingDetails = (originalPrice, discount) => {
    const GST_RATE = 0.18; // 18% GST

    const subtotal = originalPrice;
    const courseDiscount = subtotal * (discount/ 100);
    const priceAfterDiscounts = subtotal - courseDiscount;
    const gstAmount = priceAfterDiscounts * GST_RATE;
    const total = priceAfterDiscounts + gstAmount;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(courseDiscount.toFixed(2)),
        priceAfterDiscounts: parseFloat(priceAfterDiscounts.toFixed(2)),
        gst: parseFloat(gstAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
    };
};

export const getPricing = async (req,res) => {
    
    try {
        const courseId = req.params.id
        const courseDetails = await Course.findById(courseId);

        if(!courseDetails)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        const pricing = getPricingDetails(courseDetails.price, courseDetails.discount);

        return ResponseHandler.success(res, STRING_CONSTANTS.PRICING_SUCCESS,HttpStatus.OK,pricing)
        

    } catch (error) {
        console.log(STRING_CONSTANTS.PRICING_FAILED,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

export const applyCoupon = async (req,res) => {
    
    try {
        const userId = req.user.id
        const { courseId, couponCode,  } = req.body

        if (!courseId || !couponCode) {
            return ResponseHandler.error(res, 'Invalid request data', HttpStatus.BAD_REQUEST);
        }

        const coupon = await Coupon.findOne({ code : couponCode })
        const course = await Course.findById(courseId)

        const pricing = getPricingDetails(course.price, course.discount)

        // Check if coupon exists and is active
        if (!coupon || !coupon.isActive) {
            return ResponseHandler.error(res, 'Invalid coupon code', HttpStatus.BAD_REQUEST);
        }

        // Check expiration
        const currentDate = new Date();
        if (new Date(coupon.expiryDate) < currentDate) {
            return ResponseHandler.error(res, 'Coupon expired', HttpStatus.BAD_REQUEST);
        }

        // Check minimum purchase amount
        if (pricing.total < coupon.minPurchaseAmount) {
            return ResponseHandler.error(
                res, 
                `Minimum purchase of ${coupon.minPurchaseAmount} is required to apply this coupon`, 
                HttpStatus.BAD_REQUEST
            );
        }


        // Check if coupon already applied in session
        const alreadyApplied = await AppliedCoupon.findOne({ 
            userId, 
            courseId,
            couponCode: coupon.code,
            isPaymentSuccessful: false 
        });

        if (alreadyApplied) {
            return ResponseHandler.error(res, 'Coupon already applied to this order', HttpStatus.BAD_REQUEST);
        }

        // Check usage limit per user
        const userUsage = coupon.usedBy.find((entry) => entry.userId === userId);
        if (userUsage && userUsage.usage >= coupon.usageLimit) {
            return ResponseHandler.error(res, 'You have reached the usage limit for this coupon', HttpStatus.BAD_REQUEST);
        }
        
        // Calculate discount
        const discount = calculateDiscount(coupon,pricing.total)

        const appliedCoupon = await AppliedCoupon.create({
            userId,
            courseId,
            couponCode: coupon.code,
            discount,
            discountType : coupon.discountType,
            finalAmount : parseFloat((pricing.total - discount).toFixed(2))
        });

        return ResponseHandler.success(res, `${coupon.code} coupon applied successfully `,HttpStatus.OK,{
            couponCode: coupon.code,
            discount,
            finalAmount: parseFloat((pricing.total - discount).toFixed(2)),
            appliedCoupon : appliedCoupon._id
        })
        
    } catch (error) {
        console.log('Coupon Apply Failed',error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER,HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

export const fetchCurrentAppliedCoupon = async (req,res) => {
    try {
        const userId = req.user.id;

        const courseId = req.params.id;

        const order = await Order.findOne({ userId , courseId });

        const appliedCoupon = await AppliedCoupon.findOne({ userId , courseId })

        if(appliedCoupon){
            return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS,HttpStatus.OK,{
                couponCode: appliedCoupon.couponCode,
                discount : appliedCoupon.discount,
                finalAmount : appliedCoupon.finalAmount,
            })
        } 
        
        if(order && order.price.couponCode){
            return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS,HttpStatus.OK,{
                couponCode : order.price.couponCode,
                discount : order.price.couponDiscount,
                finalAmount : order.price.finalPrice,
            })
        }

        

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const removeAppliedCoupon = async (req,res) => {
    
    try {
       
        const courseId = req.params.id;
        const userId = req.user.id;

        const course = await Course.findById(courseId)

        const appliedCoupon = await AppliedCoupon.findOne({ userId, courseId })
        
        const order = await Order.findOne({ userId, courseId })

        if(!appliedCoupon && !order.price.couponCode){
            return ResponseHandler.error(res,STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST)
        }

        if(order && order.price.couponCode){
            order.price.couponCode = undefined;
            order.price.couponDiscount = undefined;
            order.price.discountType = undefined;

            const { total, discount } = getPricingDetails(course.price, course.discount)
            
            order.price.finalPrice = total;
            order.price.courseDiscount = discount;

            await order.save()
        }
        
        if(appliedCoupon){
            await AppliedCoupon.findOneAndDelete({ userId, courseId })
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}