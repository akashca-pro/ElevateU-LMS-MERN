// Admin course api endpoint

import apiSlice from "../apiSlice";

const adminCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        adminLoadPendingRequest : builder.query({
            query : ()=>({
                url : `admin/pending-request`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
        adminApproveOrRejectCourse : builder.mutation({
            query  : (credentials)=>({
                url : `admin/verify-course`,
                method : 'POST',
                body : credentials
            })
        }),
        adminLoadCourses : builder.query({
            query : (queryParams)=>({
                url : `admin/view-courses`,
                method : 'GET',
                params : queryParams
            }),
            providesTags : ['Admin']
        }),
        adminAssignCategory : builder.mutation({
            query : (credentials) =>({
                url : `admin/assign-category`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminDeleteCourse : builder.mutation({
            query : (id)=>({
                url : `admin/delete-course/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags : ['Admin']
        }),
        adminAllowOrSuspendCourse : builder.mutation({
            query : (credentials)=> ({
                url : `admin/course-status`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        })
    })
})


export const {

    // course publish request manage

    useAdminLoadPendingRequestQuery,
    useAdminApproveOrRejectCourseMutation,
    useAdminAllowOrSuspendCourseMutation,

    // course manage

    useAdminLoadCoursesQuery,
    useAdminAssignCategoryMutation,
    useAdminDeleteCourseMutation


} = adminCourseApi