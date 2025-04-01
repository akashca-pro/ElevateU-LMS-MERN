// user course learning page

import apiSlice from "../apiSlice.js";

const userCourseLearningApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        userCourseDetails : builder.query({
            query : (id) =>({
                url : `user/enrolled-course/course-details/${id}`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        userCourseCurrentStatus : builder.query({
            query : (id)=> ({
                url : `user/enrolled-course/current-status/${id}`,
                method : 'GET'
            }),
            providesTags : ['User']
        }),
        lessonOrModuleStatusChange : builder.mutation({
            query : (credentials) => ({
                url : `user/enrolled-course/lesson-status`,
                method : 'PUT',
                body : credentials
            }),
            invalidatesTags : ['User']
        })
    })
})


export const {

    useUserCourseDetailsQuery,
    useUserCourseCurrentStatusQuery,
    useLessonOrModuleStatusChangeMutation

} = userCourseLearningApi