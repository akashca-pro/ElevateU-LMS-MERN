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
        userEnrolledCourse : builder.query({
            query : (id)=>({
                url : `user/enrolled-course/${id}`,
                method : 'GET',
            }),
            providesTags : ['User']
        }),
        userEnrolledCourses : builder.query({
            query : (queryParams) =>({
                url : `user/enrolled-courses`,
                method : 'GET',
                params : queryParams
                
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
            invalidatesTags: ['Coupon'],
        }),
        userRemoveAppliedCoupon : builder.mutation({
            query : (id) => ({
                url : `user/remove-applied-coupon/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags: ['Coupon'],
        }),
        userFetchAppliedCoupon : builder.query({
            query : ({courseId})=>({
                url : `user/get-applied-coupon/${courseId}`,
                method : 'GET'
            }),
            invalidatesTags : ['Coupon']
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
        }),
        userFailedPayment : builder.mutation({
            query : (credentials) => ({
                url : `user/failed-payment/${credentials}`,
                method : 'PATCH',
            }),
            invalidatesTags :['User']
        }),
        userAddToCart : builder.mutation({
            query : (credentials) => ({
                url : `user/cart`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userLoadCart : builder.query({
            query : (courseId)=>({
                url : `user/cart/${courseId}`,
                method : 'GET'
            }),
            invalidatesTags : ['User']
        }),
        userBookmarkCourse : builder.mutation({
            query : (credentials) => ({
                url : `user/bookmark-course`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userBookmarkedCourses : builder.query({
            query : (queryParams) => ({
                url : `user/bookmark-course`,
                method : 'GET',
                params : queryParams
            }),
            providesTags : ['User']
        }),
        userRemoveBookmarkCourse : builder.mutation({
            query  : (id)=>({
                url : `user/bookmark-course/${id}`,
                method : 'PATCH',
            }),
            invalidatesTags : ['User']
        }),
        userIsBookmarked : builder.query({
            query : (id)=>({
                url : `user/isBookmarked-course/${id}`,
                method : 'GET',
            }),
            providesTags : ['User']
        }),
        loadCertificates : builder.query({
            query : ({ searchQuery, page })=>({
                url : `user/certificates`,
                method : 'GET',
                params : {
                    searchQuery,
                    page
                }
            }),
            providesTags : ['User']
        })
    })
})

export const {

    useUserEnrollCourseMutation,
    useUserEnrolledCoursesQuery,
    useUserEnrolledCourseQuery,

    useUserGetPricingQuery,
    useUserApplyCouponMutation,
    useUserRemoveAppliedCouponMutation,
    useUserFetchAppliedCouponQuery,
    useUserCreateOrderMutation,

    useUserVerifyPaymentMutation,
    useUserFailedPaymentMutation,

    useUserAddToCartMutation,
    useUserLoadCartQuery,

    useUserBookmarkCourseMutation,
    useUserBookmarkedCoursesQuery,
    useUserRemoveBookmarkCourseMutation,
    useUserIsBookmarkedQuery,

    useLoadCertificatesQuery

} = userCourseApi