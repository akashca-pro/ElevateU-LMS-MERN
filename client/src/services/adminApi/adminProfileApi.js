// Admin profile api endpoints

import apiSlice from "../apiSlice";

export const adminProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminLoadProfile : builder.query({
            query : (id)=>({
                url : `admin/profile/${id}`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminUpdateProfile : builder.mutation({
            query : (id) => ({
                url : `admin/update-profile/${id}`,
                method : 'PATCH' 
            }),
            invalidatesTags : ['Admin']
       }),
       
    })
})

export const {

    useAdminLoadProfileQuery,
    useAdminUpdateProfileMutation


} = adminProfileApi