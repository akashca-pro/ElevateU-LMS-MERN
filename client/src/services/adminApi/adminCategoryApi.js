// Admin category api endpoints

import apiSlice from "../apiSlice";

const adminCategoryApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminLoadCategories : builder.query({
            query : ({page,limit,search}) => ({
                url : `admin/categories?page=${page}&limit${limit}&search=${search}`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminAddCategory : builder.mutation({
            query : (credential) =>({
                url : `admin/add-category`,
                method : 'POST',
                body : credential
            }),
            invalidatesTags : ['Admin']
        }),
        adminUpdateCategory : builder.mutation({
            query : ({id,credential}) =>({
                url : `admin/update-category/${id}`,
                method : 'POST',
                body : credential
            }),
            invalidatesTags : ['Admin']
        }),
        adminDeleteCategory : builder.mutation({
            query : (id) =>({
                url : `admin/delete-category/${id}`,
                method : 'POST',
            }),
            invalidatesTags : ['Admin']
        }),
    })
})


export const {

    useAdminLoadCategoriesQuery,
    useAdminAddCategoryMutation,
    useAdminUpdateCategoryMutation,
    useAdminDeleteCategoryMutation

} = adminCategoryApi