import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash, BarChart3 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import { DeleteDialog } from "./components/DeleteDialog";
import {useTutorLoadCoursesQuery, useTutorDeleteCourseMutation} from '@/services/TutorApi/tutorCourseApi'
import {CreateCourseButton} from './CreateCourse/Course-create-button.jsx'

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    category: "Web Development",
    students: 120,
    status: "Published",
    image: "https://source.unsplash.com/400x300/?react,code",
  },
  {
    id: 2,
    title: "Advanced Node.js",
    category: "Backend Development",
    students: 80,
    status: "Draft",
    image: "https://source.unsplash.com/400x300/?nodejs,server",
  },
  {
    id: 3,
    title: "UI/UX Design Basics",
    category: "Design",
    students: 95,
    status: "Published",
    image: "https://source.unsplash.com/400x300/?design,ux",
  },
];

export default function Index() {
  const navigate = useNavigate()  
  const { courseName } = useParams()
  const [courseList, setCourseList] = useState(courses);
  


  return (
    <>
    { !courseName ? <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <CreateCourseButton/>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
             className="relative overflow-hidden shadow-lg">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-t-lg" />
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle
                  onClick={()=>navigate(`/tutor/profile/course-management/${encodeURIComponent(course.title)}`)}
                   className="text-lg font-semibold cursor-pointer ">{course.title}</CardTitle>
                  <p className="text-sm text-gray-500">{course.category}</p>
                </CardHeader>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${course.status === "Published" ? "text-green-500" : "text-yellow-500"}`}>
                    {course.status}
                  </span>
                  <span className="text-sm text-gray-600">{course.students} Students</span>
                </div>
              </CardContent>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex gap-2">
                    <BarChart3 size={16} /> View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                   {/* <DeleteDialog 
                   btnClass={"flex gap-2 text-red-500"} 
                   btnName={'delete'} 
                   credentials={''}
                   onSuccess={''}
                   deleteApi={useTutorDeleteCourseMutation}/> */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
    : <CourseDetails/>}

    </>
  );
}

