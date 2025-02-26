import { useState } from "react"
import Navigation from '@/components/Navigation'
import FilterSection from './FilterSection'
import CourseCard from './CourseCard'
import Pagination from '@/components/Pagination'

const CourseGrid = ({ courses }) => {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const tabs = [
    { id: "personal", label: "Personal" },
    { id: "social", label: "Finished" },
    { id: "enrolled", label: "Enrolled" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <FilterSection
        onSearch={(value) => console.log("Search:", value)}
        onCategoryChange={(category) => console.log("Category:", category)}
        onSortChange={(sort) => console.log("Sort:", sort)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={67} onPageChange={setCurrentPage} />
    </div>
  )
}

export default CourseGrid

