import { MoreVertical, Star } from "lucide-react"

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
        <button className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{course.instructor}</span>
        </div>

        <h3 className="font-medium text-[#1A064F] mb-2 line-clamp-2">{course.title}</h3>

        <div className="flex items-center mb-3">
          <span className="text-[#7454FD] font-medium mr-1">{course.rating}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(course.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">% {course.progress} Completed</span>
            <span className="text-gray-600">{course.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-[#7454FD] h-1.5 rounded-full" style={{ width: `${course.progressPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard

