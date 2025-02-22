// Tutor profile CRUD Api endpoints

import apiSlice from "../apiSlice";

const tutorProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        tutorLoadProfile : builder.query({
            query : (id) =>({
                url : `tutor/profile/${id}`,
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
            query : ({id,credentials})=>({
                url : `tutor/update-profile/${id}`,
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
    })
})

export const {

    useTutorLoadProfileQuery,
    useTutorUpdateEmailMutation,
    useTutorVerifyEmailMutation,
    useTutorUpdateProfileMutation,
    useTutorDeleteProfileMutation,
    useTutorRequestVerificationMutation

} = tutorProfileApi