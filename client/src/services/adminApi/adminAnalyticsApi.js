// admin dashboard api endpoints

import apiSlice from "../apiSlice.js";

const adminDashboardApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        bestSellingCourses : builder.query({
            query : ({ fromDate, toDate })=>({
                url : `admin/dashboard/best-selling-course`,
                method : 'GET',
                params : {
                    fromDate,
                    toDate
                }
            }),
            providesTags : ['Admin']
        })
    })  
})


export const {  

    useBestSellingCoursesQuery

} = adminDashboardApi
