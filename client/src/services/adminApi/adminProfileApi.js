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
       adminLoadNotifications : builder.query({
        query : () => ({
            url : `admin/load-notifications`,
            method : 'GET'
        }),
        providesTags : ['Admin']
       }),
       adminReadNotifications : builder.mutation({
        query : (credentials)=>({
            url : `admin/read-notifications`,
            method : 'POST',
            body : credentials
        }),
        invalidatesTags : ['Admin']
       }),
    })
})

export const {

    useAdminLoadProfileQuery,
    useAdminUpdateProfileMutation,
    useAdminLoadNotificationsQuery,
    useAdminReadNotificationsMutation


} = adminProfileApi