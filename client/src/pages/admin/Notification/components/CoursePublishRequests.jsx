import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, User, Calendar, BookOpen, Clock, Filter, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import ConfirmDialog from "./ConfirmDialog";

const CoursePublishRequests = ({ publishRequests, courseApproveOrReject, refetchPublishRequest }) => {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredRequests =
    activeFilter === "all"
      ? [...publishRequests || []].sort((b,a)=> new Date(a.createdAt) - new Date(b.createdAt) )
      : activeFilter === 'recent' ? [...publishRequests].sort((b,a)=> new Date(a.createdAt) - new Date(b.createdAt) ) 
      : [...publishRequests || []].sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt) ) 

  return (
    <Card className="w-full shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Course Publish Requests</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                {publishRequests?.length || 0}
              </Badge>
              pending requests require your review
            </CardDescription>
          </div>

          {publishRequests && publishRequests.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Requests</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("recent")}>Recent First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("oldest")}>Oldest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 px-6">
        {publishRequests && publishRequests.length > 0 ? (
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent className="-ml-4">
              {filteredRequests?.map((course, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <CourseRequestCard
                    course={course}
                    courseApproveOrReject={courseApproveOrReject}
                    refetchPublishRequest={refetchPublishRequest}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-gray-50 inline-flex rounded-full p-4 mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No pending requests</p>
            <p className="text-sm text-gray-400">All course publish requests have been reviewed</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const CourseRequestCard = ({ course, courseApproveOrReject, refetchPublishRequest }) => {
  const {
    _id: courseId,
    title,
    category,
    tutor,
    thumbnail,
    description,
    createdAt,
     modules = [],
    price,
    isFree,
    level,
  } = course

  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)

  const totalDuration = modules.reduce(
    (acc, module) => acc + module.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
    0,
  )

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : ""}`
  }

  return (
    <Card className="overflow-hidden h-full border shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={thumbnail || "/placeholder.svg?height=200&width=400&text=Course+Thumbnail"}
          alt={title}
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <Badge className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600">Pending Review</Badge>

        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90 text-gray-800 font-medium">
            {category?.name || "Uncategorized"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1" title={title}>
          {title}
        </h3>

        <div className="flex items-center mb-3">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={tutor?.profileImage} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {tutor?.firstName?.charAt(0)}
              {tutor?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 line-clamp-1">
            {tutor?.firstName} {tutor?.lastName}
          </span>
        </div>

        <div className="text-sm text-gray-500 line-clamp-2 h-10 mb-3" title={description}>
          {description || "No description provided"}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : "N/A"}
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {modules.length} modules, {totalLessons} lessons
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {formatDuration(totalDuration || 0)}
          </div>
          <div className="flex items-center font-medium">
            {isFree ? <span className="text-green-600">Free</span> : <span>${price || 0}</span>}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 py-3 bg-gray-50 border-t flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 gap-1.5"
          onClick={() => window.open(`/admin/courses/${courseId}`, "_blank")}
        >
          <Eye className="h-3.5 w-3.5" />
          View Course
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 gap-1.5"
          onClick={() => window.open(`/admin/tutors/${tutor._id}`, "_blank")}
        >
          <User className="h-3.5 w-3.5" />
          View Tutor
        </Button>
      </div>

      {/* Approve/Reject Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <ConfirmDialog
          btnName="Approve"
          btnClass="bg-green-500 hover:bg-green-600 text-white h-9 gap-1.5"
          title="Approve Course"
          description={`Are you sure you want to approve "${title}"?`}
          action={courseApproveOrReject}
          id={{ courseId: courseId, tutorId: tutor._id}}
          refetchData={refetchPublishRequest}
        />
        <ConfirmDialog
          btnName="Reject"
          btnClass="bg-red-500 hover:bg-red-600 text-white h-9 gap-1.5"
          title="Reject Course"
          description={`Are you sure you want to reject "${title}"?`}
          action={courseApproveOrReject}
          id={{ courseId: courseId, tutorId: tutor._id}}
          refetchData={refetchPublishRequest}
        />
      </div>
    </Card>
  )
}

export default CoursePublishRequests