"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  Play,
  Bookmark,
  BookmarkPlus,
  Award,
  Globe,
  Calendar,
  BarChart3,
} from "lucide-react"
import { format } from "date-fns"
import { useLoadCourseDetailsQuery } from "@/services/commonApi.js"
import { useUserLoadProfileQuery } from "@/services/userApi/userProfileApi.js"
import {
  useUserAddToCartMutation,
  useUserLoadCartQuery,
  useUserBookmarkCourseMutation,
  useUserRemoveBookmarkCourseMutation,
  useUserIsBookmarkedQuery,
} from "@/services/userApi/userCourseApi.js"
import VideoPlayer from "@/services/Cloudinary/VideoPlayer"
import { formatUrl } from "@/utils/formatUrls"
import { toast } from "sonner"
import { useSelect } from "@/hooks/useSelect"
import { CourseDetailsSkeleton } from "@/components/Skeletons/CourseDetailsSkeleton"
import { motion } from "framer-motion"

const CourseDetails = () => {
  const { tutor, admin } = useSelect()
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { data: details, isLoading, error } = useLoadCourseDetailsQuery(courseId)
  const course = details?.data

  const { data: bookmarked } = useUserIsBookmarkedQuery(courseId, {
    skip: tutor.isAuthenticated || admin.isAuthenticated,
  })
  const [bookmarkCourse] = useUserBookmarkCourseMutation()
  const [removeBookmark] = useUserRemoveBookmarkCourseMutation()

  useEffect(() => {
    if (bookmarked) {
      setIsBookmarked(true)
    }
  }, [navigate, bookmarked])

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [courseName, setCourseName] = useState("")
  const { data } = useUserLoadProfileQuery(undefined, {
    skip: tutor.isAuthenticated || admin.isAuthenticated,
  })
  const user = data?.data

  const [addToCart] = useUserAddToCartMutation()

  const openModal = (lesson) => {
    setSelectedLesson(lesson)
    setIsModalOpen(true)
  }

  const { refetch: refetchCartDetails } = useUserLoadCartQuery(undefined, {
    skip: tutor.isAuthenticated || admin.isAuthenticated,
  })

  useEffect(() => {
    if (course?.title) {
      const decodedCourseName = formatUrl(course.title)
      setCourseName(decodedCourseName)
    }

    if (user && course && user.enrolledCourses?.length > 0) {
      if (user.enrolledCourses.includes(course._id)) {
        setIsEnrolled(true)
      }
    }
  }, [user, course])

  const handleBookmark = async () => {
    try {
      if (!isBookmarked) {
        await bookmarkCourse({ courseId }).unwrap()
        setIsBookmarked(true)
        toast.info("Course Bookmarked", {
          description: `${course?.title} is added to your bookmarked collection`,
        })
      } else {
        await removeBookmark(courseId).unwrap()
        setIsBookmarked(false)
        toast.info("Bookmark removed", {
          description: `${course?.title} is removed from your bookmarked collection`,
        })
      }
    } catch (error) {
      console.log("Error bookmarking course")
      toast.error("Something went wrong")
    }
  }

  const handleEnroll = async () => {
    try {
      if (!user) {
        toast.info("Join to Enroll", {
          description: "Please log in or sign up to purchase this course.",
          duration: 4000,
        })
        return null
      }
      await addToCart({ courseId: course._id }).unwrap()
      refetchCartDetails()
      navigate(`/explore/courses/${course._id}/checkout`)
    } catch (error) {
      if (error?.status === 400) {
        navigate(`/explore/courses/${course._id}/checkout`)
        refetchCartDetails()
        return null
      }
      toast.error("Error", { description: "Error adding to cart" })
    }
  }

  const handleViewCourse = () => {
    navigate(`/user/profile/my-courses/${course._id}`)
  }

  if (isLoading) {
    return <CourseDetailsSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => navigate("/explore")}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const totalDuration = course.modules.reduce(
    (acc, module) => acc + module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
    0,
  )

  // Format duration in hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : ""}`
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-gray-50">
      {/* Hero Section with Large Thumbnail */}
      <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 transform hover:scale-105 transition-transform duration-700"
        >
          <img
            src={course?.thumbnail || "/placeholder.svg"}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12 animate-fade-in">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              {course?.level}
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md"
          >
            {course.title}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/90 text-lg max-w-3xl mb-6 drop-shadow-sm"
          >
            {course.description}
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/90"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5"
            >
              <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium mr-1">{course?.rating?.toFixed(1) || "4.5"}</span>
              <span className="text-white/70">(327 reviews)</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5"
            >
              <Users className="h-5 w-5 mr-1" />
              <span>{course.totalEnrollment?.toLocaleString() || 0} students</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5"
            >
              <Clock className="h-5 w-5 mr-1" />
              <span>{formatDuration(totalDuration)} total</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5"
            >
              <BookOpen className="h-5 w-5 mr-1" />
              <span>{totalLessons} lessons</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5"
            >
              <Calendar className="h-5 w-5 mr-1" />
              <span>Last updated {course?.updatedAt ? format(new Date(course?.updatedAt), "MMM yyyy") : "N/A"}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* What You'll Learn Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="card-hover"
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="card-hover"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Course Content</h2>
                    <div className="text-sm text-muted-foreground">
                      {course?.modules.length} modules • {totalLessons} lessons • {formatDuration(totalDuration)} total
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module, moduleIndex) => (
                      <motion.div
                        key={moduleIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * moduleIndex, duration: 0.3 }}
                      >
                        <AccordionItem value={`module-${moduleIndex}`}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-lg accordion-trigger">
                            <div className="flex justify-between items-center w-full text-left">
                              <div className="font-medium">
                                Module {moduleIndex + 1}: {module.title}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mr-4">
                                <span className="mr-4">{module.lessons.length} lessons</span>
                                <span>
                                  {formatDuration(
                                    module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
                                  )}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            <div className="space-y-1 mt-2">
                              {module.lessons.map((lesson, lessonIndex) => {
                                const isUnlocked = moduleIndex === 0 && lessonIndex === 0
                                return (
                                  <motion.div
                                    key={lessonIndex}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * lessonIndex, duration: 0.3 }}
                                    className={`flex items-center justify-between p-3 rounded-lg ${
                                      isUnlocked ? "hover:bg-muted cursor-pointer lesson-item-hover" : ""
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <motion.div
                                        whileHover={isUnlocked ? { scale: 1.1 } : {}}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                          isUnlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {isUnlocked ? (
                                          <>
                                            <Button onClick={() => openModal(lesson)}>
                                              <Play className="h-4 w-4" />
                                            </Button>
                                          </>
                                        ) : (
                                          <Lock className="h-4 w-4" />
                                        )}
                                      </motion.div>
                                      <div>
                                        <div className="font-medium">{lesson.title}</div>
                                        {lesson.attachments && lesson.attachments.length > 0 && (
                                          <div className="text-xs text-muted-foreground">
                                            {lesson.attachments.length} attachment
                                            {lesson.attachments.length !== 1 ? "s" : ""}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={isUnlocked ? "bg-primary/10 text-primary" : ""}
                                      >
                                        {lesson.duration || 0} min
                                      </Badge>
                                      {!isUnlocked && <Lock className="h-4 w-4 ml-3 text-muted-foreground" />}
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                              <DialogContent className="w-full max-w-[90vw] md:max-w-[820px] p-0 bg-white rounded-lg overflow-hidden flex flex-col items-center">
                                {/* Title Section */}
                                <DialogHeader className="p-4 bg-white text-black rounded-t-lg w-full text-center">
                                  <DialogTitle className="text-lg md:text-xl font-semibold">
                                    {selectedLesson?.title}
                                  </DialogTitle>
                                </DialogHeader>

                                {/* Video Player Section */}
                                <div className="w-full flex justify-center p-4">
                                  <VideoPlayer
                                    className="w-full md:w-[800px] h-[40vh] md:h-[450px] max-w-full max-h-[90vh] object-contain"
                                    videoUrl={selectedLesson?.videoUrl}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructor Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="card-hover"
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={course?.tutor.profileImage || "/placeholder.svg"}
                          alt={course?.tutor.firstName}
                        />
                        <AvatarFallback>{course?.tutor?.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{course?.tutor.firstName}</h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                          <span>{course?.tutor.rating} Instructor Rating</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>{course?.tutor.courseCount} Courses</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{course?.tutor.students.toLocaleString()} Students</span>
                        </motion.div>
                      </div>
                      <p className="text-muted-foreground">{course?.tutor.bio}</p>
                      <p className="text-muted-foreground">{course?.tutor.expertise}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="card-hover"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(course?.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-bold">{course?.rating?.toFixed(1) || "4.5"}</span>
                      <span className="ml-1 text-muted-foreground">({course?.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating, index) => {
                        // Calculate percentage (mock data)
                        const percentage =
                          rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                        return (
                          <motion.div
                            key={rating}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center w-12">
                              <span>{rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                            </div>
                            <Progress value={percentage} className="h-2 flex-1 progress-animate" />
                            <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                          </motion.div>
                        )
                      })}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex flex-col justify-center items-center text-center"
                    >
                      <div className="text-5xl font-bold mb-2">{course?.rating?.toFixed(1) || "4.5"}</div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 ${
                              star <= Math.round(course?.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">Course Rating</p>
                    </motion.div>
                  </div>

                  <Separator className="my-6" />

                  {/* Review List */}
                  {course?.reviews && course?.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {course?.reviews.slice(0, 3).map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 * index, duration: 0.4 }}
                          className="border-b border-gray-200 pb-6 last:border-0 review-item"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar>
                                  <AvatarFallback>{review.userId?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div>
                                <div className="font-medium">Student</div>
                                <div className="flex mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.createdAt ? format(new Date(review.createdAt), "MMM dd, yyyy") : "N/A"}
                            </div>
                          </div>
                          <p className="mt-3">{review.comment || "No comment provided."}</p>
                        </motion.div>
                      ))}

                      {course?.reviews.length > 3 && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="w-full">
                            Show All Reviews
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this course!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Column - Enrollment Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="card-float"
              >
                <Card className="shadow-lg border-2">
                  <CardContent className="p-0">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      src={course?.thumbnail || "/placeholder.svg?height=400&width=600&text=Course+Thumbnail"}
                      alt={course?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        {!isEnrolled && (
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="text-3xl font-bold"
                            >
                              {course?.isFree ? "Free" : `₹${course?.price}`}
                            </motion.span>
                            {!course?.isFree && course?.discount > 0 && (
                              <span className="text-lg line-through text-muted-foreground">
                                ₹{(course?.price * (100 / (100 - course?.discount))).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {!isEnrolled && !course?.isFree && course?.discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="bg-primary/10 text-primary rounded-md p-2 text-center text-sm font-medium"
                        >
                          {course?.discount}% discount! Limited time offer
                        </motion.div>
                      )}

                      <div className="flex items-center gap-2">
                        {/* View / Buy / Enroll Button - Full Width */}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }} className="flex-grow">
                          <Button
                            disabled={tutor.isAuthenticated || admin.isAuthenticated}
                            className="w-full text-lg py-6 button-pulse"
                            size="lg"
                            onClick={isEnrolled ? handleViewCourse : handleEnroll}
                          >
                            {isEnrolled ? "View Course" : course?.isFree ? "Enroll Now" : "Buy Now"}
                          </Button>
                        </motion.div>

                        {/* Bookmark Button - Fixed Square */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-12"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className={`w-full h-full flex items-center justify-center ${isBookmarked ? "text-primary" : ""}`}
                            onClick={handleBookmark}
                          >
                            {isBookmarked ? (
                              <Bookmark className="h-5 w-5 fill-primary" />
                            ) : (
                              <BookmarkPlus className="h-5 w-5" />
                            )}
                          </Button>
                        </motion.div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">This course includes:</h3>
                        <div className="space-y-2">
                          <motion.div whileHover={{ x: 5 }} className="flex items-center feature-item">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Full lifetime access</span>
                          </motion.div>
                          <motion.div whileHover={{ x: 5 }} className="flex items-center feature-item">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatDuration(totalDuration)} of on-demand video</span>
                          </motion.div>
                          <motion.div whileHover={{ x: 5 }} className="flex items-center feature-item">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{totalLessons} lessons</span>
                          </motion.div>
                          <motion.div whileHover={{ x: 5 }} className="flex items-center feature-item">
                            <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Certificate of completion</span>
                          </motion.div>
                          <motion.div whileHover={{ x: 5 }} className="flex items-center feature-item">
                            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Progress tracking</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseDetails
