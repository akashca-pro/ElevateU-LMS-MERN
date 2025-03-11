import React from 'react'
import { useParams } from 'react-router-dom'

const CategoryBasedCourses = () => {
    const { categoryName } = useParams()
  return (
    <div>
      {categoryName || 'category name'}
    </div>
  )
}

export default CategoryBasedCourses
