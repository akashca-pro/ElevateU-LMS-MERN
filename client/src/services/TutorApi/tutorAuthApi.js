// tutor Auth Api endpoints

import apiSlice from "../apiSlice";

const tutorAuthApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        tutorSignup : builder.mutation({
            query : (credentials) => ({
                url : 'tutor/signup',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorVerifyOtp : builder.mutation({
            query : (credentials)=> ({
                url : 'tutor/verify-otp',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorLogin : builder.mutation({
            query : (credentials)=> ({
                url : 'tutor/login',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorForgotPassword : builder.mutation({
            query : (credentials)=>({
                url : 'tutor/forgot-password',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        tutorResetPassword : builder.mutation({
            query : (credentials)=>({
                url : 'tutor/reset-password',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        tutorLogout : builder.mutation({
            query : ()=> ({
                url : 'tutor/logout',
                method : 'DELETE',
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorRefreshToken : builder.mutation({
            query : ()=> ({
                url : 'tutor/refresh-token',
                method : 'PATCH',
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorGoogleCallback : builder.query({
            query : ()=>({
                url : `tutor/auth-load`,
                method : 'GET',
            }),
        }),
        tutorIsVerified : builder.query({
            query : () => ({
                url : `tutor/is-verified`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        })
    })
})


export const {

    useTutorSignupMutation,
    useTutorVerifyOtpMutation,
    useTutorLoginMutation,
    useTutorLogoutMutation,
    useTutorRefreshTokenMutation,
    useTutorForgotPasswordMutation,
    useTutorResetPasswordMutation,
    useTutorGoogleCallbackQuery,
    useTutorIsVerifiedQuery

} = tutorAuthApi