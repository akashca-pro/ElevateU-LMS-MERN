import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Users, Clock, BookOpen, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "../utils"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function CourseInfoCard({ course }) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={course?.thumbnail || "/placeholder.svg"}
            alt={course?.name}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-xl">{course?.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  {course?.category}
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  {course?.level}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(course?.price)}</div>
              {course.originalPrice > course.price && (
                <div className="text-sm text-muted-foreground line-through">{formatCurrency(course.originalPrice)}</div>
              )}
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{course?.description}</p>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
              <Users className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Enrolled</span>
              <span className="font-medium">{course?.totalEnrollment}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="font-medium">{course?.duration} hrs</span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
              <Calendar className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Created</span>
              <span className="font-medium">{formatDate(course.createdAt)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              View Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
