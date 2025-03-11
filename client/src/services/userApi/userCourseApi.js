// User course Api endpoints

import apiSlice from "../apiSlice";

const userCourseApi = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        userEnrollCourse : builder.mutation({
            query : (credentials)=>({
                url : `user/enroll-course`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['User']
        }),
        userEnrolledCourses : builder.query({
            query : () =>({
                url : `user/enrolled-courses`,
                method : 'GET'
            }),
            providesTags : ['User']
        })
    })
})

export const {

    useUserEnrollCourseMutation,
    useUserEnrolledCoursesQuery

} = userCourseApi