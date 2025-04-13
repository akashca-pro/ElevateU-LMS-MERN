import { useState } from "react"
import TopSellersCarousel from "./TopSellersCarousel.jsx"
import { Card } from "@/components/ui/card"
import { useBestSellingCoursesQuery,useBestSellingCategoriesQuery } from '@/services/adminApi/adminAnalyticsApi.js'

export default function TopAnalytics() {
  const [courseFilter,setCourseFilter] = useState({
    fromDate: '', toDate:''
  })
  const [categoryFilter,setCategoryFilter] = useState({
    fromDate: '', toDate:''
  })
  
  const { data : courses } = useBestSellingCoursesQuery({...courseFilter})
  const { data : categories } = useBestSellingCategoriesQuery({...categoryFilter})

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="space-y-10">
        <Card className="p-6">
          <TopSellersCarousel title="Top Selling Courses" items={courses?.data || []} type="product" onApplyFilter={setCourseFilter}/>
        </Card>

        <Card className="p-6">
          <TopSellersCarousel title="Popular Categories" items={categories?.data || []} type="category" onApplyFilter={setCategoryFilter}/>
        </Card>
      </div>
    </div>
  )
}
