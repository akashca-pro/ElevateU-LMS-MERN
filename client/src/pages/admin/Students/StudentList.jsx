import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterBox } from "@/components/FilterBox";
import {useAdminLoadUsersQuery, useAdminToggleUserBlockMutation} from '@/services/adminApi/adminUserApi'
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { AlertDialogDelete } from "@/components/AlertDialog";

const StudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredQuery,setFilteredQuery] = useState('latest')
  const limit = 7;
  const navigate = useNavigate()
  const {data : students, isLoading , error ,refetch} = useAdminLoadUsersQuery({
      page : currentPage,
      search : searchQuery,
      limit,
      filter : filteredQuery
    })

    const data = students?.data;

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-2xl font-bold">Students List</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search by name and email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div >
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
          <FilterBox onSelect={setFilteredQuery}
          options={[
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "Not-Active", label: "Not-Active" },

        ]}          
          />
        </div>
      </div>
    
      {/* Table */}
   
        { error || isLoading ? <p className="text-center">No users found</p> : 
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SI</TableHead>
              <TableHead> Name</TableHead>
              <TableHead> Email</TableHead>
              <TableHead> Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((student, index) => (
              <TableRow key={student.email} >
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell 
                onClick ={()=>navigate(`/admin/profile/students/${student._id}`)}
                className="flex items-center gap-3 cursor-pointer">
                  <img
                    src={student?.profileImage || "/userIcon.png"}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  {student?.firstName}
                </TableCell>
                <TableCell>{student?.email}</TableCell>
                <TableCell>{student?.phone}</TableCell>
                <TableCell>{student?.isActive ? 'Active' : 'Not Active'}</TableCell>
                <TableCell>       
                  <AlertDialogDelete
                   btnName={student.isBlocked ? "blocked" : "Block"} 
                   btnClass={`w-24 h-10 flex items-center justify-center text-sm hover:bg-${!student.isBlocked ? "white" : "red-700"} bg-${!student.isBlocked ? "white text-black" : "red-700"}`}
                   deleteApi={useAdminToggleUserBlockMutation}
                   id={student?._id}
                   onSuccess={refetch}
                   />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>}
        

      {/* Pagination */}
      { error || isLoading ? <p className="text-center"></p> : 
      (<div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
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
      </div>)}
    </div>
  );
};

export default StudentList;
