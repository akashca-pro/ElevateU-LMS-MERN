// Admin course api endpoint

import apiSlice from "../apiSlice";

const adminCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        adminLoadPendingRequest : builder.query({
            query : ({page,limit,search})=>({
                url : `admin/pending-request?page=${page}&limit=${limit}&search=${search}`,
                method : 'GET'
            }),
            providesTags : ['Admin']
        }),
        adminCourseApprove : builder.mutation({
            query : ({id,credentials})=>({
                url : `admin/course-approve/${id}`,
                method : 'POST',
                body :credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminCourseReject : builder.mutation({
            query : ({id,credentials})=>({
                url : `admin/course-reject/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Admin']
        }),
        adminLoadCourses : builder.query({
            query : ({page,limit,search})=>({
                url : `admin/view-courses?page=${page}&limit=${limit}&search=${search}`,
                method : 'GET'
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
        })
    })
})


export const {

    // course publish request manage

    useAdminLoadPendingRequestQuery,
    useAdminCourseApproveMutation,
    useAdminCourseRejectMutation,

    // course manage

    useAdminLoadCoursesQuery,
    useAdminAssignCategoryMutation,
    useAdminDeleteCourseMutation


} = adminCourseApi