// Tutor course CRUD api endpoints

import apiSlice from "../apiSlice";

const tutorCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        tutorCreateCourse : builder.mutation({
            query : ({id,credentials}) => ({
                url : `tutor/create-course/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorLoadCourses : builder.query({
            query : ({page,limit,search}) => ({
                url : `tutor/courses?page=${page}&limit=${limit}&search=${search}`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        }),
        tutorLoadCourse : builder.query({
            query : (id) => ({
                url : `tutor/view-course/${id}`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        }),
        tutorUpdateCourse : builder.mutation({
            query : ({id,credentials})=>({
                url : `tutor/update-course/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorPublishCourse : builder.mutation({
            query : ({id,credentials}) =>({
                url : `tutor/publish-course/${id}`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorDeleteCourse : builder.mutation({
            query : (id) => ({
                url : `tutor/delete-course/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags : ['Tutor']
        })
    })
})

export const {

    useTutorCreateCourseMutation,
    useTutorLoadCoursesQuery,
    useTutorLoadCourseQuery,
    useTutorUpdateCourseMutation,
    useTutorPublishCourseMutation,
    useTutorDeleteCourseMutation

} = tutorCourseApi