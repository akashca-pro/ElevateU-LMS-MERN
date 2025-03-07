// common endpoint for user , tutor , admin

import apiSlice from "./apiSlice";

const commonApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        sendOtp : builder.mutation({
            query : (credentials) => ({
                url : `generate-otp`,
                method : 'POST',
                body :credentials
            }),
            invalidatesTags : ['Common']
        }),
        verifyOtp : builder.mutation({
            query : (credentials) => ({
                url : `verify-otp`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Common']
        }),
        loadCategories : builder.query({
            query : ()=>({
                url : `load-categories`,
                method : 'GET'
            }),
            providesTags : ['Common']
        })
    })
})


export const {

    useSendOtpMutation,
    useVerifyOtpMutation,
    useLoadCategoriesQuery

} = commonApi