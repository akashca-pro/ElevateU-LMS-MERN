// User wallet api endpoints

import apiSlice from "../apiSlice.js";

const userWalletApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        userLoadWalletDetails : builder.query({
            query : (credentials)=>({
                url : `user/wallet`,
                method : 'GET',
                params : {
                    limit : credentials
                }
            }),
            providesTags : ['User']
        })
    })
})

export const {

    useUserLoadWalletDetailsQuery

} = userWalletApi