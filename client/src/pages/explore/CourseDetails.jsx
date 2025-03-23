import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen, Clock,Users, Star, CheckCircle,Lock,  Play,  Bookmark, BookmarkPlus,
   Award, Globe, Calendar, BarChart3,
} from "lucide-react"
import { format } from "date-fns"
import { useLoadCourseDetailsQuery } from '@/services/commonApi.js'
import { useUserLoadProfileQuery } from '@/services/userApi/userProfileApi.js'
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner"
import VideoPlayer from "@/services/Cloudinary/VideoPlayer"
import { formatUrl } from "@/utils/formatUrls"

const CourseDetails = () => {
  const [selectedLesson,setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()
  const courseId = location.state
  const navigate = useNavigate()
  const { data : details, isLoading, error } = useLoadCourseDetailsQuery(courseId)
  const course = details?.data

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isEnrolled,setIsEnrolled] = useState(false)
  const [courseName,setCourseName] = useState('')
  const { data } = useUserLoadProfileQuery()
  const user = data?.data

  const openModal = (lesson) =>{
    setSelectedLesson(lesson);
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (course?.title) {
      const decodedCourseName = formatUrl(course.title);
      setCourseName(decodedCourseName);
    }
  
    if (user && course && user.enrolledCourses?.length > 0) {
      if (user.enrolledCourses.includes(course._id)) {
        setIsEnrolled(true);
      }
    }
  }, [user, course]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Add API call to save bookmark status
  }

  const handleEnroll = () => {
    navigate(`/explore/courses/${courseName}/checkout`,{state : course})
  }

  const handleViewCourse = () => {
    navigate(`/user/profile/my-courses/${courseName}`)
  }

  if (isLoading) {
    return (
      <LoadingSpinner/>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground mt-2">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" onClick={() => navigate("/explore")}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockCourse = {
    ...course,
    badges: ["Best Seller", "New", "Popular"],
    whatYouLearn: [
      "Build responsive real-world websites with HTML and CSS",
      "Modern JavaScript from the beginning - ES6, ES7, ES8",
      "Learn React.js and build powerful single-page applications",
      "Advanced CSS animations and transitions",
      "Implement authentication and authorization",
      "Deploy your applications to production",
    ],
    tutor: {
      name: "John Smith",
      bio: "Web Development Instructor with over 10 years of experience. Passionate about teaching and helping students achieve their goals.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      courses: 12,
      students: 15000,
    },
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
    <div className="bg-gray-50">
      {/* Hero Section with Large Thumbnail */}
      <div className="relative w-full h-[500px] bg-gray-900">
        <div className="absolute inset-0 opacity-60">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            
            {course?.badge && (
              <Badge 
              className={`${course?.badge === 'Best Seller' 
                ? 'bg-blue-500 hover:bg-blue-500' 
                : course?.badge === 'Trending'
                ? 'bg-red-500 hover:bg-red-500' 
                : course?.badge === 'New' 
                ? 'bg-green-500 hover:bg-green-500'
                : 'bg-yellow-500 hover:bg-yellow-500' }`}>
                
                {course.badge}

              </Badge>
            )}
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              {course?.level}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{course.title}</h1>
          <p className="text-white/80 text-lg max-w-3xl mb-6">{course.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium mr-1">{course?.rating?.toFixed(1) || "4.5"}</span>
              <span className="text-white/70">({mockCourse.reviews?.length || 0} reviews)</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-1" />
              <span>{course.totalEnrollment || 0} students enrolled</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{formatDuration(totalDuration)} total</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-1" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>
                Last updated {course?.updatedAt ? format(new Date(course?.updatedAt), "MMM yyyy") : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
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
                    <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex}>
                      <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-lg">
                        <div className="flex justify-between items-center w-full text-left">
                          <div className="font-medium">
                            Module {moduleIndex + 1}: {module.title}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mr-4">
                            <span className="mr-4">{module.lessons.length} lessons</span>
                            <span>
                              {formatDuration(module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0))}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <div className="space-y-1 mt-2">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const isUnlocked = moduleIndex === 0 && lessonIndex === 0
                            return (
                              <div
                                key={lessonIndex}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  isUnlocked ? "hover:bg-muted cursor-pointer" : ""
                                }`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                      isUnlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {isUnlocked 
                                    ? (<> 
                                    <Button
                                    onClick={()=>openModal(lesson)}                                    >
                                      <Play className="h-4 w-4" />
                                       </Button>                  
                                       </>)
                                    : <Lock className="h-4 w-4" />}
                                  </div>
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
                                  <Badge variant="outline" className={isUnlocked ? "bg-primary/10 text-primary" : ""}>
                                    {lesson.duration || 0} min
                                  </Badge>
                                  {!isUnlocked && <Lock className="h-4 w-4 ml-3 text-muted-foreground" />}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}
                 
                        >
                         <DialogContent 
                        className="w-full max-w-[90vw] md:max-w-[820px] p-0 bg-white rounded-lg overflow-hidden flex flex-col items-center"
                      >
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
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Instructor Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={course?.tutor.profileImage} alt={course?.tutor.firstName} />
                      <AvatarFallback>{course?.tutor?.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">{course?.tutor.firstName}</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{course?.tutor.rating} Instructor Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{course?.tutor.courseCount} Courses</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course?.tutor.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{course?.tutor.bio}</p>
                    <p className="text-muted-foreground">{course?.tutor.expertise}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
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
                            star <= Math.round(mockCourse.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold">{mockCourse.rating?.toFixed(1) || "4.5"}</span>
                    <span className="ml-1 text-muted-foreground">({mockCourse.reviews?.length || 0} reviews)</span>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Calculate percentage (mock data)
                      const percentage = rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center w-12">
                            <span>{rating}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                          </div>
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-col justify-center items-center text-center">
                    <div className="text-5xl font-bold mb-2">{mockCourse.rating?.toFixed(1) || "4.5"}</div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= Math.round(mockCourse.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">Course Rating</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Review List */}
                {mockCourse.reviews && mockCourse.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {mockCourse.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>{review.userId?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
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
                      </div>
                    ))}

                    {mockCourse.reviews.length > 3 && (
                      <Button variant="outline" className="w-full">
                        Show All Reviews
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-lg border-2">
                <CardContent className="p-0">
                  <img
                    src={course?.thumbnail || "/placeholder.svg?height=400&width=600&text=Course+Thumbnail"}
                    alt={course?.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                     { !isEnrolled && <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          {course?.isFree ? "Free" : `₹${course?.price}`}
                        </span>
                        {!course?.isFree && course?.discount > 0 && (
                          <span className="text-lg line-through text-muted-foreground">
                            ₹{(course?.price * (100 / (100 - course?.discount))).toFixed(2)}
                          </span>
                        )}
                      </div>}
                      { !isEnrolled && <Button
                        variant="outline"
                        size="icon"
                        className={isBookmarked ? "text-primary" : ""}
                        onClick={handleBookmark}
                      >
                        {isBookmarked ? (
                          <Bookmark className="h-5 w-5 fill-primary" />
                        ) : (
                          <BookmarkPlus className="h-5 w-5" />
                        )}
                      </Button>}
                    </div>

                    { !isEnrolled && !course?.isFree && course?.discount > 0 && (
                      <div className="bg-primary/10 text-primary rounded-md p-2 text-center text-sm font-medium">
                        {course?.discount}% discount! Limited time offer
                      </div>
                    )}

                    {<Button className="w-full text-lg py-6" size="lg" onClick={ isEnrolled ? handleViewCourse : handleEnroll}>
                    {isEnrolled ? 'View Course' : (course?.isFree ? "Enroll Now" : "Buy Now") }
                    </Button>}

                    <div className="space-y-3">
                      <h3 className="font-semibold">This course includes:</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Full lifetime access</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDuration(totalDuration)} of on-demand video</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Certificate of completion</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Progress tracking</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        Gift This Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails

