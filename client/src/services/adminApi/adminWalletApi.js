// admin wallet api endpoints

import apiSlice from "../apiSlice";

const adminWalletApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({

        loadWalletDetails : builder.query({
            query : ()=>({
                url : `admin/wallet`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
        withdrawAmount : builder.mutation({
            query : (credentials) => ({
                url : `admin/wallet/withdraw`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        })
    }),
})

export const {

    useLoadWalletDetailsQuery,
    useWithdrawAmountMutation

} = adminWalletApi