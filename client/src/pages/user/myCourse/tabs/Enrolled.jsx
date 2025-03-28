import { FilterBox } from '@/components/FilterBox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { BarChart3, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react'
import { motion } from "framer-motion";
import { useUserEnrolledCoursesQuery } from '@/services/userApi/userCourseApi.js'
import { useLoadCategoriesQuery } from '@/services/commonApi.js'
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";
import ErrorComponent from "@/components/FallbackUI/ErrorComponent";
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Enrolled = () => {
  const navigate = useNavigate()
   const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery,setSearchQuery] = useState('');
  const [filteredQuery,setFilteredQuery] = useState('');
  const limit = 6
  const { data : details, error} = useUserEnrolledCoursesQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery
  })

  
  const data = details?.data
  const courses = details?.data?.courses
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
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <FilterBox onSelect={setFilteredQuery} selectValue={'Draft'}/>
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
        {courses?.map((course) => (
          <motion.div
            key={course?._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
             className="relative overflow-hidden shadow-lg">
              <img src={course?.thumbnail || null} alt={course?.title} className="w-full h-40 object-cover rounded-t-lg" />
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle
                  onClick={()=>navigate(`/user/profile/my-courses/${course.title.replace(/\s+/g, "-")}-${course._id}`)}
                   className="text-lg font-semibold cursor-pointer ">{course?.title}</CardTitle>
                 <p className="text-sm text-gray-500">
                    Category : {categoryData?.find(cat => cat._id === course?.category)?.name || "Unknown"}
                  </p>
                </CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tutor : {course?.tutor?.firstName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress : {data?.extraDetails?.[course?._id]?.progress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{data?.extraDetails?.[course._id]?.completed ? 'Completed' : 'Ongoing'}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div> 
       }

       {/* pagination */}

        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
               <button
                 className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
               >
                 <ChevronLeft className="h-5 w-5 text-gray-600" />
               </button>
               {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                 <button
                   key={page}
                   className={`rounded-lg px-4 py-2 ${
                     currentPage === page ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                   }`}
                   onClick={() => setCurrentPage(page)}
                 >
                   {page.toString().padStart(2, "0")}
                 </button>
               ))}
               <button
                 className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                 onClick={() => setCurrentPage((prev) => prev + 1)}
                 disabled={currentPage >= (data?.totalPages || 1)}
               >
                 <ChevronRight className="h-5 w-5 text-gray-600" />
               </button>
             </div>

    </CardContent>

    </Card>
  )
}

export default Enrolled
