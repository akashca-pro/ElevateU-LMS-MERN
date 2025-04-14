import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FilterBox } from "@/components/FilterBox"
import { useUserBookmarkedCoursesQuery, useUserRemoveBookmarkCourseMutation } from "@/services/userApi/userCourseApi.js"
import BookmarkedCourseCard from "../components/BookmarkCourseCard"

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search, Bookmark, BookmarkX } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}

const BookmarkedCourses = () => {
  const [removeBookmark] = useUserRemoveBookmarkCourseMutation()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuery, setFilteredQuery] = useState("")
  const limit = 6

  const {
    data: details,
    refetch,
    error,
    isLoading,
  } = useUserBookmarkedCoursesQuery({
    page: currentPage,
    search: searchQuery,
    limit,
    filter: filteredQuery,
  })

  const data = details?.data
  const courses = details?.data?.courses

  const handleRemoveBookmark = async (courseId, courseTitle) => {
    try {
      await removeBookmark(courseId).unwrap()
      toast({
        title: "Bookmark removed",
        description: `${courseTitle} is removed from your bookmarked collection`,
        variant: "default",
      })
      refetch()
    } catch (error) {
      console.log("Error removing bookmark")
      toast({
        title: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Bookmarked Courses
              </CardTitle>
              <CardDescription className="mt-1">Your saved courses for future learning</CardDescription>
            </div>

            <div className="relative flex gap-4 w-full max-w-md">
              <Input
                type="text"
                placeholder="Search by name and description"
                className="pl-10 border-primary/20 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary/60" />
              <FilterBox
                onSelect={setFilteredQuery}
                options={[
                  { value: "latest", label: "Latest" },
                  { value: "oldest", label: "Oldest" },
                ]}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <SkeletonGrid />
          ) : error || courses?.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {courses?.map((course, index) => (
                  <motion.div key={course._id || index} variants={item} exit={{ opacity: 0, y: -20 }} layout>
                    <BookmarkedCourseCard course={course} onRemoveBookmark={handleRemoveBookmark} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && courses?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 flex-wrap"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 p-0"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`rounded-full w-10 h-10 p-0 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 p-0"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= (data?.totalPages || 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Skeleton loading state
const SkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl overflow-hidden shadow-md">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Empty state
const EmptyState = () => {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="bg-primary/10 p-6 rounded-full mb-4">
        <BookmarkX className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No Bookmarked Courses</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You haven't bookmarked any courses yet. Browse courses and bookmark the ones you're interested in for later.
      </p>
      <Button
      onClick={()=>navigate('/explore')} 
      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
        <Bookmark className="mr-2 h-4 w-4" />
        Browse Courses
      </Button>
    </motion.div>
  )
}

export default BookmarkedCourses
