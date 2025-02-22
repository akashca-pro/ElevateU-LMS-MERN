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
                url : 'user/verifyotp',
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
    })
})

export const {

    useUserSignupMutation,
    useUserVerifyOtpMutation,
    useUserLoginMutation,
    useUserLogoutMutation,
    useUserRefreshTokenMutation

} = userAuthApi