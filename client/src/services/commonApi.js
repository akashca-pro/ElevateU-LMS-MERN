// common endpoint for user , tutor , admin

import apiSlice from "./apiSlice";

const commonApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        sendOtp : builder.mutation({
            query : (credentials) => ({
                url : `generate-otp`,
                method : 'POST',
                body :credentials
            })
        }),
        verifyOtp : builder.mutation({
            query : (credentials) => ({
                url : `verify-otp`,
                method : 'POST',
                body : credentials
            })
        })
    })
})


export const {

    useSendOtpMutation,
    useVerifyOtpMutation

} = commonApi