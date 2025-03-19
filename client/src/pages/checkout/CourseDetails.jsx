import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, User, BookOpen, Calendar, Award } from "lucide-react"

const CourseDetails = ({ course }) => {
  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(Number.parseFloat(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle>Course Details</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={course?.thumbnail || "/placeholder.svg"}
                alt={course?.title}
                className="w-full aspect-video object-cover"
              />
              {course?.hasCertification && (
                <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                  <Award className="mr-1 h-3 w-3" />
                  Certificate
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{course?.title}</h2>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{course?.tutor?.firstName}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{course?.duration} hours</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(course?.rating)}
              {/* <span className="text-sm text-gray-500">({course?.reviewCount} reviews)</span> */}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course?.description}</p>

            <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
            <span>{course?.modules?.length || 0} modules</span>
            </div>
              <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span>
            {course?.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
          </span>
          </div>
              <div className="flex items-center text-sm">
                <Award className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course?.level}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseDetails

