import { z } from "zod";

export const couponSchema = z.object({
    code : z
    .string().min(4, 'Coupon code must be atleast 3 characters'),
    discountType: z
    .string()
    .refine((val)=>val==='percentage'||val==='fixed',{
        message : "Discount type is required "
    }) , 
    discountValue : z
    .number()
    .min(1,'Discount must be at least 1% or 1'),
    expiryDate : z
    .string().refine(
        (date)=> new Date(date) > new Date(),
        'Expiry date must be in the future' 
    ),
    minPurchaseAmount: z
    .number().min(0, "Minimum purchase must be 0 or more"),
    maxDiscount: z
    .number().optional(),
    usageLimit : z
    .number().min(1,'Value should be positive'),
    isActive : z
    .boolean().optional()

}).superRefine((data, ctx)=>{
    if(data.discountType === 'percentage' && data.discountValue > 100){
        ctx.addIssue({
            path : ['discountValue'],
            message : 'Percentage discount cannot exceed 100%'
        })
    }
})

