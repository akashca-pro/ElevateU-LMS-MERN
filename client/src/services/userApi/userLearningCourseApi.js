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
        }),
        loadLessonDetails : builder.query({
            query : (credentials) => ({
                url : `user/lesson`,
                method : 'GET',
                params : {
                    courseId: credentials.courseId,
                    lessonId: credentials.lessonId,
                    moduleId: credentials.moduleId,
                }
            }),
            providesTags : ['User']
        }),
        resetCourseProgress : builder.mutation({
            query : (id) => ({
                url : `user/reset-progress/${id}`,
                method : 'PUT',
            }),
            invalidatesTags : ['User']
        }),
        checkEnrollment : builder.query({
            query : (id) => ({
                url : `user/check-enrollment/${id}`,
                method : 'GET',
            }),
            providesTags : ['User']
        })
    })
})


export const {

    useUserCourseDetailsQuery,
    useUserCourseCurrentStatusQuery,
    useLessonOrModuleStatusChangeMutation,
    useLoadLessonDetailsQuery,
    useResetCourseProgressMutation,
    useCheckEnrollmentQuery

} = userCourseLearningApi