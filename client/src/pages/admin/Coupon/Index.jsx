import { ChevronLeft, ChevronRight, Delete, Edit, Search, Trash, Trash2 } from 'lucide-react'
import React, { use, useState } from 'react'
import FormModal from './components/FormModal'
import { FilterBox } from '@/components/FilterBox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdminCreateCouponMutation, useAdminLoadCouponsQuery,
     useAdminDeleteCouponMutation, useAdminUpdateCouponMutation} from '@/services/adminApi/adminCouponApi.js'  
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/FallbackUI/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { AlertDialogDelete } from '@/components/AlertDialog'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredQuery,setFilteredQuery] = useState('latest')
    const limit = 7;
    const navigate = useNavigate()
    const {data : coupon, isLoading , error ,refetch} = useAdminLoadCouponsQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery
  })

  const data = coupon?.data

  if(isLoading) return(<LoadingSpinner/>)
 
  return (
    <Card className="container mx-auto px-4 py-8">
      <CardTitle>
      <h1 className="mb-8 text-2xl font-bold text-center md:text-left">Coupon Management</h1>
      </CardTitle>

    <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search by name and description"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div >
        <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
            <FormModal useAction={useAdminCreateCouponMutation} refetch={refetch}/> 
          <FilterBox onSelect={setFilteredQuery} 
          options={[
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "Not-Active", label: "Not-Active" },
        ]}          
          />
        </div>
    </div>

    <CardContent className="overflow-x-auto">
    { error ? <p className="text-center">No coupon found</p> :
        <Table>
            <TableCaption>List of available coupons</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-12">SI</TableHead>
                <TableHead >Coupon Code</TableHead>
                <TableHead >Discount Type</TableHead>
                <TableHead >Discount Value</TableHead>
                <TableHead >Min Purchase</TableHead>
                <TableHead >Max Discount</TableHead>
                <TableHead >Usage Limit</TableHead>
                <TableHead >Expiry</TableHead>
                <TableHead >Status</TableHead>
                <TableHead colSpan={2} className='text-center' >Actions</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
               {data?.coupons?.map((coupon,index)=>(
                <TableRow key={index} className="hover:bg-gray-100">

                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>{`${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ''}`}</TableCell>
                <TableCell>{coupon.minPurchaseAmount}</TableCell>
                <TableCell>{coupon.maxDiscount}</TableCell>
                <TableCell>{coupon.usageLimit}</TableCell>
                <TableCell>{format(new Date(coupon.expiryDate),'PPP')}</TableCell>
                <TableCell>{coupon.isActive ? 'Active' : 'InActive'}</TableCell>
                <TableCell>   
                    <FormModal useAction={useAdminUpdateCouponMutation} existValues={data?.coupons[index]} refetch={refetch}/> 
                </TableCell>
                <TableCell>
                <AlertDialogDelete
                onSuccess={refetch}
                id={coupon._id}
                btnName={  <Trash2 />} 
                btnClass={"bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"}
                deleteApi={useAdminDeleteCouponMutation}
                />  
                </TableCell>
                </TableRow>
               ))}
            </TableBody>
        </Table> }
    </CardContent>

    {/* Pagination */}
   { data?.coupons?.length > 0 && <CardFooter className="mt-6 flex items-center justify-center gap-2 flex-wrap">
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
      </CardFooter>}

    </Card>
  )
}

export default Index
