import { FilterBox } from '@/components/FilterBox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useUserBookmarkedCoursesQuery, useUserRemoveBookmarkCourseMutation } from '@/services/userApi/userCourseApi.js'
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";
import ErrorComponent from "@/components/FallbackUI/ErrorComponent";
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookmarkedCourseCard from '../components/BookmarkCourseCard';

const Bookmark = () => {
    const [removeBookmark] = useUserRemoveBookmarkCourseMutation()
     const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery,setSearchQuery] = useState('');
    const [filteredQuery,setFilteredQuery] = useState('');
    const limit = 6
    const { data : details, refetch} = useUserBookmarkedCoursesQuery({
      page : currentPage,
      search : searchQuery,
      limit,
      filter : filteredQuery
    })

    const data = details?.data
    const courses = details?.data?.courses

    const handleRemoveBookmark = async(courseId, courseTitle) => {
        try {
        await removeBookmark(courseId).unwrap();
        toast.info('Bookmark removed',{
          description : `${courseTitle} is removed from your bookmarked collection`
        })
        refetch()
        } catch (error) {
          console.log('Error bookmarking course')
          toast.error('Something went wrong');
        }
    } 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center" >
          Bookmarked Courses
        <div className="relative flex gap-4 w-full max-w-md">
        <input
         type="text"
          placeholder="Search by name and description"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <FilterBox onSelect={setFilteredQuery} disable={true}/>
      </div>
        </CardTitle>
      </CardHeader>

    <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course,index)=>(
          <BookmarkedCourseCard key={index} course={course} onRemoveBookmark={handleRemoveBookmark}/>
      ))}
    </div>


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

export default Bookmark
