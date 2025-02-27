import React from 'react'
import CourseGrid from './CourseGrid'

const CourseDetails = () => {
    // Sample course data
    const courses = [
      {
        id: 1,
        title: "Learn Figma - UI/UX Design Essential Training",
        instructor: "Ali Tufan",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%208.55.54%E2%80%AFPM-mMprRaB8n1yJZtFUF1Re2H6baL1ndZ.png",
        rating: 4.5,
        progress: 20,
        progressPercent: 25,
      },
      // Add more courses as needed
    ]
  
    return (
      <div className="min-h-screen bg-gray-50">
        <CourseGrid courses={courses} />
      </div>
    )
  }

export default CourseDetails
