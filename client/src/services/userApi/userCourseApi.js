// User course Api endpoints

import apiSlice from "../apiSlice";

const userCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        userEnrollCourse : builder.mutation({
            query : (credentials)=>({
                url : `user/enroll-course`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userEnrolledCourses : builder.query({
            query : () =>({
                url : `user/enrolled-courses`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        userGetPricing : builder.query({
            query : (id) => ({
                url : `user/get-pricing/${id}`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        userApplyCoupon : builder.mutation({
            query : (credentials)=>({
                url : `user/apply-coupon`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userRemoveAppliedCoupon : builder.mutation({
            query : (id) => ({
                url : `user/remove-applied-coupon/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags : ['User']
        }),
        userFetchAppliedCoupon : builder.query({
            query : (id)=>({
                url : `user/get-applied-coupon/${id}`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        userCreateOrder : builder.mutation({
            query : (credentials) => ({
                url : `user/create-order`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userVerifyPayment : builder.mutation({
            query : (credentials) => ({
                url : `user/verify-payment`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags :['User']
        })
    })
})

export const {

    useUserEnrollCourseMutation,
    useUserEnrolledCoursesQuery,
    useUserGetPricingQuery,
    useUserApplyCouponMutation,
    useUserRemoveAppliedCouponMutation,
    useUserFetchAppliedCouponQuery,
    useUserCreateOrderMutation,
    useUserVerifyPaymentMutation

} = userCourseApi