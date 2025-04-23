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
            query : (credentials)=>({
                url : `tutor/update-email`,
                method : 'PATCH',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        tutorVerifyEmail : builder.mutation({
            query : (credentials) =>({
                url : `tutor/verify-email`,
                method : 'PATCH',
                body : credentials
            }),
            invalidatesTags : ['User']
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
        tutorUpdatePassword : builder.mutation({
            query : (credentials) => ({
                url : `tutor/profile/update-password`,
                method : 'PATCH',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorVerifyOtpForPassword : builder.mutation({
            query : (credentials) => ({
                url : `tutor/profile/update-password/verify-otp`,
                method : 'PATCH',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorResendOtpForPasswordChange : builder.mutation({
            query : ()=>({
                url : `tutor/profile/update-password/re-send-otp`,
                method : 'PATCH',
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorDeactivateAccount : builder.mutation({
            query : ()=>({
                url : `tutor/profile/deactivate-account`,
                method : 'PATCH'
            }),
            invalidatesTags : ['Tutor']
        })
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
    useTutorReadNotificationsMutation,
    useTutorUpdatePasswordMutation,
    useTutorResendOtpForPasswordChangeMutation,
    useTutorVerifyOtpForPasswordMutation,
    useTutorDeactivateAccountMutation

} = tutorProfileApi