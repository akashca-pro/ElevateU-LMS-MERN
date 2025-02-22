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
        tutorLogout : builder.mutation({
            query : ()=> ({
                url : 'tutor/logout',
                method : 'PATCH',
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
    })
})


export const {

    useTutorSignupMutation,
    useTutorVerifyOtpMutation,
    useTutorLoginMutation,
    useTutorLogoutMutation,
    useTutorRefreshTokenMutation

} = tutorAuthApi