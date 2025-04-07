// tutor wallet api endpoints

import apiSlice from "../apiSlice.js";

const tutorWalletApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        loadWallet : builder.query({
            query : (credentials)=>({
                url : `tutor/wallet`,
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

    useLoadWalletQuery

} = tutorWalletApi