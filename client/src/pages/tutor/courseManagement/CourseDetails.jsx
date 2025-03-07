import React from 'react'
import { useParams } from 'react-router-dom'

const CourseDetails = () => {
    const {courseName} = useParams()
  return (
    <div>
      {courseName}
    </div>
  )
}

export default CourseDetails
