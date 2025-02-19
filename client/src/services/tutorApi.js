// Tutor API calls

import apiSlice from "./apiSlice";

const tutorApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        tutorSignup : builder.mutation({
            query : (credentials) => ({
                url : 'tutor/signup',
                method : 'POST',
                body : credentials
            })
        }),
        tutorVerifyOtp : builder.mutation({
            query : (credentials)=> ({
                url : 'tutor/verifyotp',
                method : 'POST',
                body : credentials
            })
        }),
        tutorLogin : builder.mutation({
            query : (credentials)=> ({
                url : 'tutor/login',
                method : 'POST',
                body : credentials
            })
        }),
        tutorLogout : builder.mutation({
            query : ()=> ({
                url : 'tutor/logout',
                method : 'POST',
            })
        }),
        tutorRefreshToken : builder.mutation({
            query : ()=> ({
                url : 'tutor/refreshtoken',
                method : 'POST',
            })
        }),
    })
})

export const {

    useTutorSignupMutation,
    useTutorVerifyOtpMutation,
    useTutorLoginMutation,
    useTutorLogoutMutation,
    useTutorRefreshTokenMutation
    
} = tutorApi