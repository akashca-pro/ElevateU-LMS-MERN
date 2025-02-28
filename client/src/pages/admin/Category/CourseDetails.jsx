import React from 'react'
import {useParams , useNavigate} from 'react-router-dom'

const CourseDetails = () => {
  const {courseDetails} = useParams()
  return (
    <div>
      {courseDetails}
    </div>
  )
}

export default CourseDetails
