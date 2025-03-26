import { ChevronLeft, ChevronRight, Delete, Edit, Search, Trash, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { FilterBox } from './components/FilterBox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminLoadOrdersQuery } from '@/services/adminApi/adminOrderApi.js'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/FallbackUI/LoadingSpinner'

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredQuery,setFilteredQuery] = useState('All')
    const [sortedQuery,setSortedQuery] = useState('Latest')
    const limit = 7;
    const {data : orders, isLoading , error ,refetch} = useAdminLoadOrdersQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery,
    sort : sortedQuery
  })

  const filterValues = ['All','Pending','Success','Failed']
  const sortValues = ['Latest','Oldest','Price-low-to-high','Price-high-to-low']
  
  const data = orders?.data
  console.log(data)

  if(isLoading) return(<LoadingSpinner/>)
 
  return (
    <div className='container mx-auto p-6 max-w-full overflow-x-auto'>
    <h1 className="mb-8 text-2xl font-bold text-center md:text-left">Order List</h1>

    <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search by student name and email, course name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div >
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
          <FilterBox onSelect={setFilteredQuery} filterValues={filterValues} title={'Filter'}/>
          <FilterBox onSelect={setSortedQuery} filterValues={sortValues} title={'Sort'}/>
        </div>
    </div>

    <div className="overflow-x-auto">
    { error ? <p className="text-center">No Order found</p> :
        <Table>
            <TableCaption>List of available Orders</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-12">SI</TableHead>
                <TableHead >Order ID</TableHead>
                <TableHead >Student Name</TableHead>
                <TableHead >Student Email</TableHead>
                <TableHead >Course Purchased</TableHead>
                <TableHead >Amount Paid</TableHead>
                <TableHead >Transaction ID</TableHead>
                <TableHead >Payment Status</TableHead>
                <TableHead >Coupon Used</TableHead>
                <TableHead >Order Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
               {data?.orders?.map((order,index)=>(
                <TableRow key={index} className="hover:bg-gray-100">

                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>{order?.paymentDetails.orderId}</TableCell>
                <TableCell>{order?.userData.name}</TableCell>
                <TableCell>{order?.userData.email}</TableCell>
                <TableCell>{order?.courseName}</TableCell>
                <TableCell>{order?.price.finalPrice}</TableCell>
                <TableCell>{order?.paymentDetails.transactionId ? order?.paymentDetails.transactionId : 'N/A'}</TableCell>
                <TableCell
                className = {`${order?.paymentStatus === 'pending' 
                  ? 'text-yellow-500' 
                  : order?.paymentStatus === 'success' 
                  ? 'text-green-500' 
                  : 'text-red-500'}`}
                >{order?.paymentStatus}</TableCell>
                <TableCell>{order?.price.couponCode ? order?.price.couponCode : 'N/A'}</TableCell>
                <TableCell>{format(new Date(order?.createdAt),'PPP')}</TableCell>
                </TableRow>
               ))}
            </TableBody>
        </Table> }
    </div>

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

export default Index
