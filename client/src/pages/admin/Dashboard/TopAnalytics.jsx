import { useEffect, useState } from "react"
import { topProducts, topCategories, topBrands } from "./mockData.js"
import TopSellersCarousel from "./TopSellersCarousel.jsx"
import { Card } from "@/components/ui/card"
import { useBestSellingCoursesQuery } from '@/services/adminApi/adminAnalyticsApi.js'

export default function TopAnalytics() {
  const [bestSellingCourseFilter,setbestSellingCourseFilter] = useState({
    fromDate: '', toDate:''
  })
  const [bestSellingCategoryFilter,setbestSellingCategoryFilter] = useState({
    fromDate: '', toDate:''
  })
  
  const { data : courses } = useBestSellingCoursesQuery({...bestSellingCourseFilter})

  const [bestSellingCourse,setBestSellingCourses] = useState([{
    _id: "",
    totalSales: 0,
    title: "",
    thumbnail: "",
    description: "",
    price: 0,
    isFree: false,
    level: "",
    tutorName: "",
    tutorImage: "",
    category: "",
  }])

useEffect(()=>{

  if(courses?.data){
    setBestSellingCourses(courses?.data)
  }

},[bestSellingCourseFilter, courses, bestSellingCourse])

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="space-y-10">
        <Card className="p-6">
          <TopSellersCarousel title="Top Selling Courses" items={bestSellingCourse} type="product" onApplyFilter={setbestSellingCourseFilter}/>
        </Card>

        <Card className="p-6">
          <TopSellersCarousel title="Popular Categories" items={topCategories} type="category" onApplyFilter={bestSellingCategoryFilter}/>
        </Card>
      </div>
    </div>
  )
}
