import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bookmark, BookOpen, Clock, MoreVertical, Star, User, X } from "lucide-react"

const BookmarkedCourseCard = ({ course, onRemoveBookmark }) => {
  const navigate = useNavigate()
  const [isHovering, setIsHovering] = useState(false)

  // Calculate discounted price
  const discountedPrice = course.isFree ? 0 : course.price - (course.price * course.discount) / 100

  // Format price display
  const formatPrice = (price) => {
    return price.toFixed(2)
  }

  // Handle view course details
  const handleViewCourse = () => {
    navigate(`/explore/courses/${course._id}`)
  }


  // Handle remove bookmark with confirmation
  const handleRemoveBookmark = (e) => {
    e.stopPropagation()
    onRemoveBookmark(course._id, course.title);
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className="h-full"
    >
      <Card
        className="overflow-hidden h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-shadow"
        onClick={handleViewCourse}
      >
        {/* Course Thumbnail */}
        <div className="relative">
          <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />

          {/* Level Badge */}
          <Badge
            variant="outline"
            className="absolute top-3 left-3 bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200"
          >
            {course.level}
          </Badge>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            {course.isFree ? (
              <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
            ) : (
              <Badge className="bg-primary hover:bg-primary/90">
                ₹{formatPrice(discountedPrice)}
                {course.discount > 0 && (
                  <span className="ml-1.5 line-through text-xs opacity-70">${formatPrice(course.price)}</span>
                )}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          {/* Course Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:underline cursor-pointer">{course.title}</h3>

          {/* Instructor Info */}
          <div className="flex items-center mb-3">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={course.tutor.profileImage} alt={course.tutor.firstName} />
              <AvatarFallback>{course.tutor.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-400">{course.tutor.firstName}</span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Star className="h-3.5 w-3.5 text-yellow-400 mr-1.5 fill-yellow-400" />
              <span>{course.rating}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>{course.totalEnrollment.toLocaleString()}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>{course.duration} hours</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>{course.categoryName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                  className='w-full'
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCourse()
                    }}
                  >
                    View Course Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Course Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
            variant='outline'
            onClick={handleRemoveBookmark}>
                  <Bookmark className="h-4 w-4 fill-primary stroke-none" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BookmarkedCourseCard

