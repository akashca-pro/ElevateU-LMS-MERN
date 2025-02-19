// User API calls

import apiSlice from "./apiSlice";

const userApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        userSignup : builder.mutation({
            query : (credentials)=>({
                url : 'user/signup',
                method : 'POST',
                body : credentials
            }) 
        }),
        userVerifyOtp : builder.mutation({
            query : (credentials)=>({
                url : 'user/verifyotp',
                method : 'POST',
                body : credentials
            })
        }),
        userLogin : builder.mutation({
            query : (credentials)=>({
                url : 'user/login',
                method : 'POST',
                body : credentials
            })
        }),
        userLogout : builder.mutation({
            query : ()=>({
                url : 'user/verifyotp',
                method : 'POST',
            })
        }),
        userRefreshToken : builder.mutation({
            query : ()=>({
                url : 'user/refreshToken',
                method : 'POST',
            })
        }),
    })
})

export const {

    useUserSignupMutation,
    useUserVerifyOtpMutation,
    useUserLoginMutation,
    useUserLogoutMutation,
    useUserRefreshTokenMutation,
    
} = userApi