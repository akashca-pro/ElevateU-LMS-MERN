import { FilterBox } from '@/components/FilterBox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { BarChart3, MoreHorizontal, Search } from 'lucide-react'
import { motion } from "framer-motion";
import { useUserEnrolledCoursesQuery } from '@/services/userApi/userCourseApi.js'
import { useLoadCategoriesQuery } from '@/services/commonApi.js'
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";
import ErrorComponent from "@/components/FallbackUI/ErrorComponent";

const Enrolled = () => {
  const { data : details, error} = useUserEnrolledCoursesQuery()
  const courseDetails = details?.data?.enrollments?.course
  const tutorDetails = courseDetails?.tutor
  const { data : categoryDetails } = useLoadCategoriesQuery()
    const categoryData = categoryDetails?.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center" >
          Enrolled courses
        <div className="relative flex gap-4 w-full max-w-md">
        <input
         type="text"
          placeholder="Search by name and description"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
        value={''}
        // onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
         <FilterBox />
      </div>
        </CardTitle>
      </CardHeader>

    <CardContent>

      {/* Course Grid */}
      {error ? 
      <p
      className="text-xl font-semibold text-gray-600 bg-gray-100 p-4 rounded-lg shadow-md text-center"
    >
      No Course Found
    </p>
        :  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseDetails?.map((course) => (
          <motion.div
            key={course._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
             className="relative overflow-hidden shadow-lg">
              <img src={course?.thumbnail || null} alt={course.title} className="w-full h-40 object-cover rounded-t-lg" />
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle
                  onClick={()=>navigate(`/user/profile/course-management/${course._id}`)}
                   className="text-lg font-semibold cursor-pointer ">{course.title}</CardTitle>
                 <p className="text-sm text-gray-500">
                    {categoryData?.find(cat => cat._id === course.category)?.name || "Unknown"}
                  </p>
                </CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tutor : {tutorDetails?.name}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div> 
       }

    </CardContent>

    </Card>
  )
}

export default Enrolled
