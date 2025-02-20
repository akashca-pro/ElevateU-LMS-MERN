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
            invalidatesTags : ['Admin']
        }),
        adminLogin : builder.mutation({
            query : (credentials)=>({
                url : 'admin/login',
                method : 'POST',
                body : credentials,
            }),
            invalidatesTags : ['Admin']
        }),
        adminLogout : builder.mutation({
            query : ()=> ({
                url : 'admin/logout',
                method : 'POST',
            }),
            invalidatesTags : ['Admin']
        }),
        adminRefreshToken : builder.mutation({
            query : (credentials)=>({
                url : 'admin/refresh-token',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
    })
})

export const {
    
    useAdminSignupMutation,
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminRefreshTokenMutation

} = adminApi