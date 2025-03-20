// Admin coupon api

import apiSlice from "../apiSlice";

const couponApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({

        adminCreateCoupon : builder.mutation({
            query : (credentials) => ({
                url : `admin/create-coupon`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminLoadCoupons : builder.query({
            query : ({page,limit,search,filter})=>({
                url : `admin/load-coupons`,
                method : 'GET',
                params: {
                    page,
                    limit,
                    search,
                    filter
                }
            }),
            providesTags : ['Admin']
        }),
        adminDeleteCoupon : builder.mutation({
            query : (id)=>({
                url : `admin/delete-coupon/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags : ['Admin']
        })
    })
})

export const {

    useAdminCreateCouponMutation,
    useAdminLoadCouponsQuery,
    useAdminDeleteCouponMutation

} = couponApi