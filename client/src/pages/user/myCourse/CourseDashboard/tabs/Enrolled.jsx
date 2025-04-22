import { FilterBox } from "@/components/FilterBox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Search, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserEnrolledCoursesQuery } from "@/services/userApi/userCourseApi.js"
import { useLoadCategoriesQuery } from "@/services/commonApi.js"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}

const Enrolled = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuery, setFilteredQuery] = useState("")
  const limit = 6

  const {
    data: details,
    error,
    isLoading,
  } = useUserEnrolledCoursesQuery({
    page: currentPage,
    search: searchQuery,
    limit,
    filter: filteredQuery,
  })

  const data = details?.data
  const courses = details?.data?.courses
  const { data: categoryDetails } = useLoadCategoriesQuery()
  const categoryData = categoryDetails?.data

  return (
    <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            My Enrolled Courses
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex gap-4 w-full max-w-md"
          >
            <Input
              type="text"
              placeholder="Search by name and description"
              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary focus:ring-primary pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <FilterBox
              onSelect={setFilteredQuery}
              options={[
                { value: "latest", label: "Latest" },
                { value: "oldest", label: "Oldest" },
              ]}
            />
          </motion.div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          // Skeleton loading state
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                    <Skeleton className="w-full h-40 rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        ) : error || courses?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Found</h3>
            <p className="text-gray-500 max-w-md">
              You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              onClick={() => navigate("/explore")}
            >
              Browse Courses
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses?.map((course) => (
                <motion.div key={course?._id} variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
                  <Card className="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={course?.thumbnail || "/placeholder.svg?height=200&width=400&text=Course+Thumbnail"}
                        alt={course?.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 font-medium">
                        {categoryData?.find((cat) => cat._id === course?.category)?.name || "General"}
                      </Badge>

                      {data?.extraDetails?.[course._id]?.isCompleted && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-5 flex-grow">
                      <h3
                        onClick={() => navigate(`/user/profile/my-courses/${course._id}`)}
                        className="text-lg font-bold mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                      >
                        {course?.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {course?.tutor?.firstName?.charAt(0) || "T"}
                        </div>
                        <span className="text-sm text-gray-600">
                          {course?.tutor?.firstName} {course?.tutor?.lastName}
                        </span>
                      </div>

                      <div className="space-y-4 mt-auto">
                        <div>
                          <div className="flex justify-between items-center mb-1.5 text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-primary">
                              {data?.extraDetails?.[course?._id]?.courseProgress || "0"}%
                            </span>
                          </div>
                          <Progress
                            value={data?.extraDetails?.[course?._id]?.courseProgress || 0}
                            className="h-2 bg-gray-100"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {data?.extraDetails?.[course._id]?.isCompleted ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span>In Progress</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant="outline"
                        className="w-full hover:bg-primary hover:text-white transition-colors"
                        onClick={() => navigate(`/user/profile/my-courses/${course._id}`)}
                      >
                        Continue Learning
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!isLoading && courses?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-2 flex-wrap"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 p-0 border-gray-200"
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
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white border-none"
                    : "border-gray-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 p-0 border-gray-200"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= (data?.totalPages || 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default Enrolled
