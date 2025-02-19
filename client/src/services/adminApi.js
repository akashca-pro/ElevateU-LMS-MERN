// Admin API calls

import apiSlice from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
    endpoints : (builder)=> ({
        adminSignup : builder.mutation({
            query : (credentials)=> ({
                url : 'admin/signup',
                method : 'POST',
                body : credentials,
            }),
        }),
        adminLogin : builder.mutation({
            query : (credentials)=>({
                url : 'admin/login',
                method : 'POST',
                body : credentials,
            }),
        }),
        adminLogout : builder.mutation({
            query : ()=> ({
                url : 'admin/logout',
                method : 'POST',
            }),
        }),
        adminRefreshToken : builder.mutation({
            query : (credentials)=>({
                url : 'admin/refreshtoken',
                method : 'POST',
                body : credentials
            })
        })
    })
})

export const {
    
    useAdminSignupMutation,
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminRefreshTokenMutation

} = adminApi