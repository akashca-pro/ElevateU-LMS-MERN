// common endpoint for user , tutor , admin

import apiSlice from "./apiSlice";

const commonApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        sendOtp : builder.mutation({
            query : (credentials) => ({
                url : `generate-otp`,
                method : 'POST',
                body :credentials
            }),
            invalidatesTags : ['Common']
        }),
        verifyOtp : builder.mutation({
            query : (credentials) => ({
                url : `verify-otp`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['Common']
        }),
        loadCategories : builder.query({
            query : ()=>({
                url : `load-categories`,
                method : 'GET'
            }),
            providesTags : ['Common']
        }),
        isBlocked : builder.query({
            query : (role)=>({
                url : `${role}/isblocked`,
                method : 'GET'
            })
        }),
        loadTopRatedCourses : builder.query({
            query : ()=>({
                url : `courses/top-rated`,
                method : 'GET'
            }),
            providesTags : ['Common']
        }),
        loadBestSellersCourses : builder.query({
            query : ()=>({
                url : `courses/best-sellers`,
                method : 'GET'
            }),
            providesTags : ['Common']
        }),
        loadNewReleasesCourses : builder.query({
            query : ()=>({
                url : `courses/new-releases`,
                method : 'GET'
            }),
            providesTags : ['Common']
        }),
        loadTrendingCourses : builder.query({
            query : ()=>({
                url : `courses/trending`,
                method : 'GET'
            }),
            providesTags : ['Common']
        }),
        loadCourseDetails : builder.query({
            query : (id) => ({
                url : `courses/${id}`,
                method : 'GET'
            })
        })
        
        
    })
})


export const {

    useSendOtpMutation,
    useVerifyOtpMutation,
    useLoadCategoriesQuery,
    useIsBlockedQuery,
    useLoadTopRatedCoursesQuery,
    useLoadBestSellersCoursesQuery,
    useLoadNewReleasesCoursesQuery,
    useLoadTrendingCoursesQuery,
    useLoadCourseDetailsQuery

} = commonApi