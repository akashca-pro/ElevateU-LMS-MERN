// Admin profile api endpoints

import apiSlice from "../apiSlice";

export const adminProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminLoadProfile : builder.query({
            query : ()=>({
                url : `admin/profile`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminUpdateProfile : builder.mutation({
            query : (credentials) => ({
                url : `admin/update-profile`,
                method : 'POST' ,
                body : credentials
            }),
            invalidatesTags : ['Admin']
       }),
       
    })
})

export const {

    useAdminLoadProfileQuery,
    useAdminUpdateProfileMutation


} = adminProfileApi