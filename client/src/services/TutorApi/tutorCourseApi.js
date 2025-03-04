// Tutor course CRUD api endpoints

import apiSlice from "../apiSlice";

const tutorCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        tutorCreateCourse : builder.mutation({
            query : (credentials) => ({
                url : `tutor/create-course`,
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
            query : () => ({
                url : `tutor/view-course`,
                method : 'GET'
            }),
            providesTags : ['Tutor']
        }),
        tutorUpdateCourse : builder.mutation({
            query : (credentials)=>({
                url : `tutor/update-course`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorPublishCourse : builder.mutation({
            query : (credentials) =>({
                url : `tutor/publish-course`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorDeleteCourse : builder.mutation({
            query : () => ({
                url : `tutor/delete-course`,
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