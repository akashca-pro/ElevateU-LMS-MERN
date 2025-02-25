// common endpoint for user , tutor , admin

import apiSlice from "./apiSlice";

const commonApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        reSendOtp : builder.mutation({
            query : (credentials) => ({
                url : `resend-otp`,
                method : 'POST',
                body : credentials
            })
        })
    })
})


export const {

    useReSendOtpMutation

} = commonApi