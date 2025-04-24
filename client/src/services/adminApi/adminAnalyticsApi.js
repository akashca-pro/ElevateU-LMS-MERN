// admin dashboard api endpoints

import apiSlice from "../apiSlice.js";

const adminDashboardApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        bestSellingCourses : builder.query({
            query : ({ fromDate, toDate })=>{
              console.log('Query sent to backend:', fromDate, toDate) // log this
              return {
                url : `admin/dashboard/best-selling-course`,
                method : 'GET',
                params : {
                    fromDate,
                    toDate
                }
              }
            },
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
        revenueChart: builder.query({
            query: ({ year, month, viewType, weekType }) => {
              const params = {
                year,
                viewType,
              };
          
              if (viewType === "monthly" || viewType === "weekly") {
                params.month = month;
              }
          
              if (viewType === "weekly") {
                params.weekType = weekType; // this can be 'this' or 'last'
              }
          
              return {
                url: `admin/dashboard/revenue-chart-data`,
                method: "GET",
                params,
              };
            },
            providesTags: ["Admin"],
          })
    })  
})


export const {  

    useBestSellingCoursesQuery,
    useBestSellingCategoriesQuery,
    useDashboardMetricsQuery,
    useRevenueChartQuery

} = adminDashboardApi
