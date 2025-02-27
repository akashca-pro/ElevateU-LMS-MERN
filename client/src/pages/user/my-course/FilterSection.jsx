import { Search, ChevronDown } from "lucide-react"

const FilterSection = ({ onSearch, onCategoryChange, onSortChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="relative w-full md:w-auto flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search Courses"
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7454FD] focus:border-transparent"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <button className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 w-full md:w-auto">
          <span>Categories</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 w-full md:w-auto">
          <span>Old Review</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default FilterSection

