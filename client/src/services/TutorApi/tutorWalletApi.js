// tutor wallet api endpoints

import apiSlice from "../apiSlice.js";

const tutorWalletApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        tutorLoadWalletDetails : builder.query({
            query : (credentials)=>({
                url : `tutor/wallet`,
                method : 'GET',
                params : {
                    limit : credentials
                }
            }),
            providesTags : ['User']
        }),
        addBankAccount : builder.mutation({
            query : (credentials) => ({
                url : `tutor/bank-details`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        loadBankDetails : builder.query({
            query : ()=>({
                url : `tutor/bank-details`,
                method : 'GET',
            }),
            providesTags : ['Tutor']
        }),
        withdrawRequest : builder.mutation({
            query : (credentials)=>({
                url : `tutor/withdrawal-request`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        loadWithdrawRequest : builder.query({
            query : () =>({
                url : `tutor/withdrawal-request`,
                method : 'GET'
            })
        })
    })
})

export const {

    useAddBankAccountMutation,
    useLoadBankDetailsQuery,
    useWithdrawRequestMutation,
    useLoadWithdrawRequestQuery,
    useTutorLoadWalletDetailsQuery

} = tutorWalletApi