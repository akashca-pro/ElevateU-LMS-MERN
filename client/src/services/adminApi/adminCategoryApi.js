// Admin category api endpoints

import apiSlice from "../apiSlice";

const adminCategoryApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminLoadCategories : builder.query({
            query : ({page,limit,search, filter}) => ({
                url : `admin/categories?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        adminLoadCategory : builder.query({
            query : (name)=>({
                url : `admin/category?name=${name}`,
                method : 'GET'
            })
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
            query : (credential) =>({
                url : `admin/update-category`,
                method : 'POST',
                body : credential
            }),
            invalidatesTags : ['Admin']
        }),
        adminDeleteCategory : builder.mutation({
            query : (id) =>({
                url : `admin/delete-category/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Admin']
        }),
    })
})


export const {

    useAdminLoadCategoriesQuery,
    useAdminAddCategoryMutation,
    useAdminUpdateCategoryMutation,
    useAdminDeleteCategoryMutation,
    useAdminLoadCategoryQuery

} = adminCategoryApi