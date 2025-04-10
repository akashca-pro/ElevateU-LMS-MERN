// Admin order api

import apiSlice from "../apiSlice";

const adminOrderApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        adminLoadOrders : builder.query({
            query : (queryParams) => ({
                url : `admin/orders`,
                method : 'GET',
                params : queryParams
            }),
            providesTags : ['Admin']
        }),
        loadTransactions : builder.query({
            query : (page) =>({
                url : `admin/transactions?page=${page}`,
                method : 'GET'
            })
        })
    })
})

export const {

    useAdminLoadOrdersQuery,
    useLoadTransactionsQuery

} = adminOrderApi