// Admin tutor api endpoints

import apiSlice from "../apiSlice";

const adminTutorApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminAddTutor : builder.mutation({
            query : (credentials) => ({
                url : `admin/add-tutor`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminLoadTutorsDetails : builder.query({
            query : ({page,limit,search}) => ({
                url : `admin/tutors-details?page=${page}&limit=${limit}&search=${search}`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
        adminLoadTutorDetails : builder.query({
            query : (id) => ({
                url : `admin/tutor-details/${id}`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
        adminUpdateTutor : builder.mutation({
            query : ({id,credentials}) => ({
                url : `admin/update-tutor-details/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminDeleteTutor : builder.mutation({
            query : (id) => ({
                url : `admin/delete-tutor/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Admin']
        }),
        adminVerificationRequest : builder.query({
            query : () => ({
                url : `admin/verification-request`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
       adminApproveOrRequest : builder.mutation({
        query : (credentials) => ({
            url : `admin/control-verification`,
            method : 'POST',
            body : credentials
        })
       }),
       adminToggleTutorBlock : builder.mutation({
        query : (id) =>({
            url : `admin/toggle-tutor-block/${id}`,
            method :'PATCH'
        })
       }),
       loadWithdrawRequests : builder.query({
        query : ({ page, limit, filter }) =>({
           url : `admin/withdraw-request`,
           method : 'GET',
           params: {
            page,
            limit,
            filter: JSON.stringify(filter)
          }
        }),
        providesTags : ['Admin']
       }),
       approveOrRejectWithdrawRequest : builder.mutation({
        query : (credentials) => ({
            url : `admin/withdraw-request/approve-or-reject`,
            method : 'PATCH',
            body : credentials
        }),
        invalidatesTags : ['Admin']
       })
    })
})

export const {

    // Tutor CRUD

    useAdminAddTutorMutation,
    useAdminLoadTutorsDetailsQuery,
    useAdminLoadTutorDetailsQuery,
    useAdminUpdateTutorMutation,
    useAdminDeleteTutorMutation,
    useAdminToggleTutorBlockMutation,

    // notification from tutor verification request

    useAdminVerificationRequestQuery,
    useAdminApproveOrRequestMutation,

    // withdraw request 

    useLoadWithdrawRequestsQuery,
    useApproveOrRejectWithdrawRequestMutation

} = adminTutorApi