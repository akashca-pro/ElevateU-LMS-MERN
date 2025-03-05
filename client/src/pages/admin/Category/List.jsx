import {  useState } from "react"
import { Search, ChevronLeft, ChevronRight ,Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Table, TableBody,TableCaption,TableCell, TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import FormModal from "./components/FormModal"
import {useAdminLoadCategoriesQuery, useAdminAddCategoryMutation, 
  useAdminDeleteCategoryMutation, useAdminUpdateCategoryMutation} from '@/services/adminApi/adminCategoryApi'
import { AlertDialogDelete } from "@/components/AlertDialog"
import { Badge } from "@/components/ui/badge"
import { FilterBox } from "@/components/FilterBox"

const List = () => {
  
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredQuery,setFilteredQuery] = useState('latest')
  const limit = 7
  const navigate = useNavigate()
  const {data : category, isLoading , error ,refetch} = useAdminLoadCategoriesQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery
  })
  const data = category?.data;
 
  return (
    <div className="container mx-auto p-6 max-w-full overflow-x-auto">
      <h1 className="mb-8 text-2xl font-bold text-center md:text-left">Categories</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name and description"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div >
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
          <FormModal title={'Add Category'} useCategory={useAdminAddCategoryMutation} 
          style={"bg-blue-600 hover:bg-blue-700 rounded-lg border border-gray-300 px-4 py-2"} type={'add'}/>
          <FilterBox onSelect={setFilteredQuery}/>
        </div>
      </div>

     { error || isLoading ? <p className="text-center">No category found</p> : 
     <div className="overflow-x-auto">
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
          {data?.categories?.map((category, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
              <TableCell 
              onClick={() => navigate(`/admin/profile/category/${category.name.toLowerCase()}`)}
              className="font-semibold">
                {category.name} </TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell className="flex flex-col md:flex-row items-center justify-end gap-2">
                <Badge 
                  className={`${category?.isActive ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded text-sm ${category?.isActive ? 'hover:bg-green-500' : 'hover:bg-red-500'}`}
                >
                 {category?.isActive ? 'Active' : 'Not Active'}
                </Badge>
                <div className="flex flex-wrap justify-end gap-2">
                <FormModal title={'Edit Category'} 
                useCategory={useAdminUpdateCategoryMutation}
                name={category.name}
                type={'edit'} 
                style={"bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"}/>
                <AlertDialogDelete 
                onSuccess={refetch}
                id={category._id}
                btnName={  <Trash2 />} 
                btnClass={"bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"}
                deleteApi={useAdminDeleteCategoryMutation}
                />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      }

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <button
          className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`rounded-lg px-4 py-2 ${
              currentPage === page ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page.toString().padStart(2, "0")}
          </button>
        ))}
        <button
          className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= (data?.totalPages || 1)}
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default List
