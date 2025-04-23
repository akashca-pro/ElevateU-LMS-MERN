import ErrorComponent from '@/components/FallbackUI/ErrorComponent'
import { useLoadCategoriesQuery } from '@/services/commonApi.js'
import CoursesListing from './CoursesListing'
import { CourseListingSkeleton } from '@/components/Skeletons/CourseListingSkeleton'

const ExplorePage = () => {
  const { data : details ,isLoading , isError} = useLoadCategoriesQuery()
      const categories = details?.data
  

  if(isLoading)return(<CourseListingSkeleton/>)

  if(isError)return(<ErrorComponent/>) 

  return (
    <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>

          
          <CoursesListing categories={categories} />

      
    </div>
  )
}

export default ExplorePage
