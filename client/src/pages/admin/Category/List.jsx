import { useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const categoriesData = [
  {
    id: 1,
    name: "Technical",
    description: "Courses on programming, AI, and web development",
  },
  {
    id: 2,
    name: "Science",
    description: "Physics, Chemistry, and Biology courses",
  },
  {
    id: 3,
    name: "Literature",
    description: "Classical and modern literary studies",
  },
]

const List = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-2xl font-bold">Categories</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Categories"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2">
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

   
      <Table>
        <TableCaption>List of available categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">SI</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesData.map((category, index) => (
            <TableRow key={category.id} className="hover:bg-gray-50">
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-semibold">{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary"
                  onClick={() => navigate(`/admin/profile/category/${category.name.toLowerCase()}`)}
                >
                  View Courses
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`rounded-lg px-4 py-2 ${
              currentPage === page ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page.toString().padStart(2, "0")}
          </button>
        ))}
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default List
