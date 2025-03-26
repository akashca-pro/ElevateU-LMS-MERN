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
        })
    })
})

export const {

    useAdminLoadOrdersQuery

} = adminOrderApi