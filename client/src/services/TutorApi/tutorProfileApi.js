// Tutor profile CRUD Api endpoints

import apiSlice from "../apiSlice";

const tutorProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        tutorLoadProfile : builder.query({
            query : () =>({
                url : `tutor/profile`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        }),
        tutorUpdateEmail : builder.mutation({
            query : ({id,credentials})=>({
                url : `tutor/update-email/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorVerifyEmail : builder.mutation({
            query : (credentials)=>({
                url : `tutor/verify-email`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorUpdateProfile : builder.mutation({
            query : (credentials)=>({
                url : `tutor/update-profile`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorDeleteProfile : builder.mutation({
            query : (id)=>({
                url : `tutor/delete-account/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorRequestVerification : builder.mutation({
            query : (id)=>({
                url : `tutor/request-verification/${id}`,
                method : 'PATCH',
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorLoadNotifications : builder.query({
            query : ()=> ({
                url : `tutor/load-notifications`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        }),
        tutorReadNotifications : builder.mutation({
            query : (credentials)=>({
                url : `tutor/read-notifications`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
    })
})

export const {

    useTutorLoadProfileQuery,
    useTutorUpdateEmailMutation,
    useTutorVerifyEmailMutation,
    useTutorUpdateProfileMutation,
    useTutorDeleteProfileMutation,
    useTutorRequestVerificationMutation,
    useTutorLoadNotificationsQuery,
    useTutorReadNotificationsMutation

} = tutorProfileApi