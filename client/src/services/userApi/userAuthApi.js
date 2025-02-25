// user Auth Api endpoints

import apiSlice from "../apiSlice";

const userAuthApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        userSignup : builder.mutation({
            query : (credentials)=>({
                url : 'user/signup',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userVerifyOtp : builder.mutation({
            query : (credentials)=>({
                url : 'user/verify-otp',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userLogin : builder.mutation({
            query : (credentials)=>({
                url : 'user/login',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userForgotPassword : builder.mutation({
            query : (credentials)=>({
                url : 'user/forgot-password',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userResetPassword : builder.mutation({
            query : (credentials)=>({
                url : 'user/reset-password',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        
        userLogout : builder.mutation({
            query : ()=>({
                url : 'user/logout',
                method : 'PATCH',
            }),
            invalidatesTags : ['User']
        }),
        userRefreshToken : builder.mutation({
            query : ()=>({
                url : 'user/refresh-token',
                method : 'PATCH',
            }),
            invalidatesTags : ['User']
        }),
        userGoogleCallback : builder.query({
            query : ()=>({
                url : `user/auth-load`,
                method : 'GET',
            }),
        }),
    })
})

export const {

    useUserSignupMutation,
    useUserVerifyOtpMutation,
    useUserLoginMutation,
    useUserForgotPasswordMutation,
    useUserResetPasswordMutation,
    useUserLogoutMutation,
    useUserRefreshTokenMutation,
    useUserGoogleCallbackQuery,

} = userAuthApi