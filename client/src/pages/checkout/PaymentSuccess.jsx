
import { Button } from "@/components/ui/button"
import { CheckCircle2, BookOpen, LibraryBig } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderDetails = location.state

  setTimeout(()=>{

  },[4000])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Enrollment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for enrolling in <span className="font-semibold">{orderDetails?.courseTitle}</span>.Your payment has been
          processed successfully.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">ORD-{orderDetails?.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">₹{orderDetails?.amountPaid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">Razorpay</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium">{orderDetails?.transactionId}</p>
            </div>
            
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          You will be redirected to the course dashboard shortly. If not, click the button below.
        </p>

        <div className="flex flex-row gap-4">
        <Button size="lg" className="flex-1 " onClick={()=>navigate(`/user/profile/my-courses/${orderDetails?.courseId}`,{replace : true})}>
         Learn Now <BookOpen className="h-4 w-4" />
        </Button>
        <Button size="lg" className="flex-1 " onClick={()=>navigate(`/user/profile/my-courses?tab=enrolled`,{replace : true})}>
         Enrolled Courses <LibraryBig className="h-4 w-4" />
        </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

