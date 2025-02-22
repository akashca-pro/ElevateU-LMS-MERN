// Admin - user api endpoints

import apiSlice from "../apiSlice";

const adminUserApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        
        adminAddUser : builder.mutation({
            query : (credentials) => ({
                url : 'admin/add-user',
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminLoadUsers : builder.query({
            query : ({page,limit,search})=>({
                url : `admin/users-details?page=${page}&limit=${limit}&search=${search}`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminLoadUserDetails : builder.query({
            query : (id)=>({
                url : `admin/user-details/${id}`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminUpdateUserDetails : builder.mutation({
            query : ({id,credentials}) => ({
                url : `admin/update-user-details/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminDeleteUser : builder.mutation({
            query : (id) => ({
                url : `admin/delete-user/${id}`,
                method : 'DELETE',
               
            }),
            invalidatesTags : ['Admin']
        }),
    })
})

export const {

    useAdminLoadUsersQuery,
    useAdminLoadUserDetailsQuery,
    useAdminAddUserMutation,
    useAdminUpdateUserDetailsMutation,
    useAdminDeleteUserMutation,

} = adminUserApi