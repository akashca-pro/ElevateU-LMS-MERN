import AppliedCoupon from "../../model/AppliedCoupons.js";
import Coupon from "../../model/coupon.js";
import Course from "../../model/course.js"
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

const getPricingDetails = (courseDetails) => {
    const GST_RATE = 0.18; // 18% GST

    const subtotal = courseDetails.price;
    const courseDiscount = subtotal * (courseDetails.discount / 100);
    const priceAfterDiscounts = subtotal - courseDiscount;
    const gstAmount = priceAfterDiscounts * GST_RATE;
    const total = priceAfterDiscounts + gstAmount;

    return {
        subtotal: subtotal.toFixed(2),
        discount: courseDiscount.toFixed(2),
        priceAfterDiscounts: priceAfterDiscounts.toFixed(2),
        gst: gstAmount.toFixed(2),
        total: total.toFixed(2),
    };
};

export const getPricing = async (req,res) => {
    
    try {
        const courseId = req.params.id
        const courseDetails = await Course.findById(courseId);

        if(!courseDetails)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND)

        const pricing = getPricingDetails(courseDetails);

        return ResponseHandler.success(res, STRING_CONSTANTS.PRICING_SUCCESS,HttpStatus.OK,pricing)
        

    } catch (error) {
        console.log(STRING_CONSTANTS.PRICING_FAILED,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

export const applyCoupon = async (req,res) => {
    
    try {
        const userId = req.user.id
        const { details } = req.body

        if (!details || !details.code || !details.total) {
            return ResponseHandler.error(res, 'Invalid request data', HttpStatus.BAD_REQUEST);
        }

        const coupon = await Coupon.findOne({ code : details.code })

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
        if (details.total < coupon.minPurchaseAmount) {
            return ResponseHandler.error(
                res, 
                `Minimum purchase of ${coupon.minPurchaseAmount} is required to apply this coupon`, 
                HttpStatus.BAD_REQUEST
            );
        }


        // Check if coupon already applied in session
        const alreadyApplied = await AppliedCoupon.findOne({ 
            userId, 
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
        let discount;
        if (coupon.discountType === 'percentage') {
           
            const calculatedDiscount = details.total * (coupon.discountValue / 100);
            
            discount = coupon.maxDiscount > 0 ? Math.min(calculatedDiscount, coupon.maxDiscount) : calculatedDiscount;
        } else {
            discount = Math.min(coupon.discountValue, details.total);
        }

        discount = parseFloat(discount.toFixed(2));

        const appliedCoupon = await AppliedCoupon.create({
            userId,
            couponCode: coupon.code,
            discount,
            discountType : coupon.discountType,
            finalAmount : parseFloat((details.total - discount).toFixed(2))
        });

        return ResponseHandler.success(res, `${coupon.code} coupon applied successfully `,HttpStatus.OK,{
            couponCode: coupon.code,
            discount,
            finalAmount: parseFloat((details.total - discount).toFixed(2)),
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

        const appliedCoupon = await AppliedCoupon.findOne({userId})

        if(!appliedCoupon) 
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND,HttpStatus.OK)

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_SUCCESS,HttpStatus.OK,{
            couponCode: appliedCoupon.couponCode,
            discount : appliedCoupon.discount,
            finalAmount : appliedCoupon.finalAmount,
            appliedCoupon : appliedCoupon._id
        })

    } catch (error) {
        console.log(STRING_CONSTANTS.LOADING_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const removeAppliedCoupon = async (req,res) => {
    
    try {
        const appliedCouponId = req.params.id;
        if(!appliedCouponId)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const appliedCoupon = await AppliedCoupon.findById(appliedCouponId)

        if(!appliedCoupon)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        await AppliedCoupon.findByIdAndDelete(appliedCouponId)

        return ResponseHandler.success(res, STRING_CONSTANTS.DELETION_SUCCESS, HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.DELETION_ERROR,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}