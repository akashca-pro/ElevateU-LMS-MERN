// user profile CRUD api endpoints

import apiSlice from "../apiSlice";

const userProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        userLoadProfile : builder.query({
            query : ()=>({
                url : `user/profile`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        userUpdateEmail : builder.mutation({
            query : ({id,credentials})=>({
                url : `user/update-email/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userVerifyEmail : builder.mutation({
            query : (credentials) =>({
                url : `user/verify-email`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userUpdateProfile : builder.mutation({
            query : ({id,credentials}) =>({
                url : `user/update-profile/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userDeleteAccount : builder.mutation({
            query : (id) =>({
                url : `user/delete-account/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags : ['User']
        })  
    })
})

export const {

    useUserLoadProfileQuery,
    useUserUpdateEmailMutation,
    useUserVerifyEmailMutation,
    useUserUpdateProfileMutation,
    useUserDeleteAccountMutation

} = userProfileApi