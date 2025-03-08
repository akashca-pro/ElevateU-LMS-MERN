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
            query : ({page, limit, search, filter}) => ({
                url : `tutor/courses?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
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
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Tutor']
        }),
        tutorCheckTitleCourse : builder.query({
            query : (id) => ({
                url : `tutor/check-title/${id}`,
                method : 'GET'
            }) 
        })
    })
})

export const {

    useTutorCreateCourseMutation,
    useTutorLoadCoursesQuery,
    useTutorLoadCourseQuery,
    useTutorUpdateCourseMutation,
    useTutorPublishCourseMutation,
    useTutorDeleteCourseMutation,
    useTutorCheckTitleCourseQuery,

} = tutorCourseApi