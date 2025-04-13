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
        }),
        bestSellingCategories : builder.query({
            query : ({ fromDate, toDate }) => ({
                url : `admin/dashboard/best-selling-category`,
                method : 'GET',
                params : {
                    fromDate,
                    toDate
                }
            }),
            providesTags : ['Admin']
        }),
        dashboardMetrics : builder.query({
            query : ()=>({
                url : `admin/dashboard`,
                method : 'GET',
            }),
            providesTags : ['Admin']
        }),
        revenueChart : builder.query({
            query : ({ year })=>({
                url : `admin/dashboard/revenue-chart-data`,
                method : 'GET',
                params : {
                    year
                }
            }),
            providesTags : ['Admin']
        })
    })  
})


export const {  

    useBestSellingCoursesQuery,
    useBestSellingCategoriesQuery,
    useDashboardMetricsQuery,
    useRevenueChartQuery

} = adminDashboardApi
