import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, BarChart3, ChevronLeft, ChevronRight, Search} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {useNavigate, useParams } from "react-router-dom";
import {useTutorLoadCoursesQuery } from '@/services/TutorApi/tutorCourseApi'
import { useLoadCategoriesQuery } from '@/services/commonApi'
import {CreateCourseButton} from './CreateCourse/Course-create-button.jsx'
import { FilterBox } from "@/components/FilterBox";
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";
import ErrorComponent from "@/components/FallbackUI/ErrorComponent";


export default function Index() {
  const { data : details } = useLoadCategoriesQuery()
  const categoryData = details?.data;

  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredQuery,setFilteredQuery] = useState('latest')
  const limit = 7
  const { courseName } = useParams()

  const {data : courses, isLoading, error , refetch , status} = useTutorLoadCoursesQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery
  })  
  const data = courses?.data

  if(isLoading) return (<LoadingSpinner/>)

  if(status === 500) return (<ErrorComponent onRetry={()=>window.location.reload()}/>)

  return (
    <>
    <div className="container mx-auto p-6 max-w-full overflow-x-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4 w-full">
        <h1 className="text-2xl font-bold">My Courses</h1>
    <   div className="relative w-full max-w-md">
        <input
         type="text"
          placeholder="Search by name and description"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>

      <div className="flex justify-end gap-2 w-full md:w-auto">
        <CreateCourseButton />
        <FilterBox onSelect={setFilteredQuery}
          options={[
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "Not-Active", label: "Not-Active" },
            { value: "Draft", label: "Draft" },
        ]}
        
        />
      </div>
    </div>

      {/* Course Grid */}
      {error ? 
      <p
      className="text-xl font-semibold text-gray-600 bg-gray-100 p-4 rounded-lg shadow-md text-center"
    >
      No Course Found
    </p>
        :  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.courses.map((course) => (
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
                  onClick={()=>navigate(`/tutor/profile/course-management/${course._id}`)}
                   className="text-lg font-semibold cursor-pointer ">{course.title}</CardTitle>
                 <p className="text-sm text-gray-500">
                    {categoryData?.find(cat => cat._id === course.category)?.name || "Unknown"}
                  </p>
                </CardHeader>
                <div className="flex justify-between items-center">
                  <span 
                  className={`text-sm font-medium ${course.status === "approved" 
                    ? "text-green-500" 
                    : course.status === "pending"
                    ? 'text-blue-500'
                    : course.status === 'rejected'
                    ? 'text-red-500' : 'text-yellow-500' }`}>

                    {course.status === 'approved' 
                    ? 'Active' 
                    : course.status === 'pending'
                    ? 'Awaiting approval' 
                    : course.status === 'rejected'
                    ? 'Request rejected'
                    : 'draft' }
                  </span>
                  <span className="text-sm text-gray-600">{course.totalEnrollment} Students</span>
                </div>
              </CardContent>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex gap-2">
                    <BarChart3 size={16} /> View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                   {/* <DeleteDialog 
                   btnClass={"flex gap-2 text-red-500"} 
                   btnName={'delete'} 
                   credentials={''}
                   onSuccess={''}
                   deleteApi={useTutorDeleteCourseMutation}
                   
                   /> */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          </motion.div>
        ))}
      </div> 
       }

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

    </div>
    

    </>
  );
}

