import React, { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Delete, Edit, Search, Trash, Trash2 } from 'lucide-react'
import { FilterBox } from '@/components/FilterBox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/FallbackUI/LoadingSpinner'
import { useLoadWithdrawRequestsQuery,useApproveOrRejectWithdrawRequestMutation } from '@/services/adminApi/adminTutorApi.js'
import ConfirmDialog from './ConfirmDialog'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const WithdrawRequests = () => {
      const [approveOrReject] = useApproveOrRejectWithdrawRequestMutation()
      const [currentPage, setCurrentPage] = useState(1)
      const [queryParams, setQueryParams] = useState({
        page: currentPage,
        limit: 5,
        filter: {
          sort : 'latest',
          search: "",
        }
      });

      const { data, isLoading, refetch } = useLoadWithdrawRequestsQuery({ 
        ...queryParams
       })

       const requests = data?.data?.requests
       console.log(data)

         if(isLoading) return(<LoadingSpinner/>)

  return (
    <Card className="w-full shadow-md border-0">
         <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg pb-4">
    <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Withdraw Requests</CardTitle>
    <CardDescription className="mt-1 flex items-center">
        <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
        {requests?.length || 0}
        </Badge>
        pending requests require your review
    </CardDescription>
    </CardHeader>
    <CardContent className="pt-6 px-6">
    {requests?.length > 0 && <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search by name and description"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={queryParams.filter.search}
            onChange={(e) =>
                setQueryParams((prev) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    search: e.target.value,
                  },
                }))
              }
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div >
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
        <FilterBox
        onSelect={(val) =>
            setQueryParams((prev) => ({
            ...prev,
            filter: { ...prev.filter, sort: val },
            }))
        }
        options={[
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "price-high-low", label: "Price High-Low" },
            { value: "price-low-high", label: "Price Low-High" },
        ]}
         />
        </div>
    </div>}
   
    <div className="overflow-x-auto">
    { requests?.length === 0 
    ? <div className="py-12 text-center">
    <div className="bg-gray-50 inline-flex rounded-full p-4 mb-4">
      <BookOpen className="h-8 w-8 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium mb-1">No pending requests</p>
    <p className="text-sm text-gray-400">All withdrawal requests have been reviewed</p>
  </div> 
    :
        <Table>
            <TableCaption>List of available withdrawal requests</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-12">SI</TableHead>
                <TableHead >Username</TableHead>
                <TableHead >Role</TableHead>
                <TableHead >Email</TableHead>
                <TableHead >Amount</TableHead>
                <TableHead >Payment method</TableHead>
                <TableHead >status</TableHead>
                <TableHead >Initiated date</TableHead>
                <TableHead colSpan={2} className='text-center' >Actions</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
               {requests?.map((req,index)=>(
                <TableRow key={index} className="hover:bg-gray-100">
                <TableCell>{(currentPage - 1) * queryParams.limit + index + 1}</TableCell>
                <TableCell>{req.userName}</TableCell>
                <TableCell>{req.userModel}</TableCell>
                <TableCell>{req.email}</TableCell>
                <TableCell>{req.amount}</TableCell>
                <TableCell>{req.paymentMethod}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>{format(new Date(req.createdAt),'PPP')}</TableCell>
                <TableCell colSpan={2}>
                <div className="flex gap-6 justify-center">
                    <ConfirmDialog
                    btnName="Approve"
                    btnClass="bg-green-500 hover:bg-green-600 text-white h-9 gap-1.5"
                    title={`Approve ${req.userModel}`}
                    description={`Are you sure you want to approve ${req.userName}`}
                    action={approveOrReject}
                    id={req._id}
                    refetchData={refetch}
                    />
                    <ConfirmDialog
                    btnName="Reject"
                    btnClass="bg-red-500 hover:bg-red-600 text-white h-9 gap-1.5"
                    title={`Reject ${req.userModel}`}
                    description={`Are you sure you want to reject ${req.userName} `}
                    action={approveOrReject}
                    id={req._id}
                    refetchData={refetch}
                    />
                </div>
                </TableCell>
                </TableRow>
               ))}
            </TableBody>
        </Table> }
    </div>
    </CardContent>
    <CardFooter className="flex justify-center px-4 py-6">
  { data?.totalPages > 4 && <div className="flex items-center gap-2 flex-wrap">
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
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          currentPage === page
            ? "bg-primary text-white"
            : "text-gray-600 hover:bg-gray-100"
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
  </div>}
</CardFooter>
    </Card>
  )
}

export default WithdrawRequests
