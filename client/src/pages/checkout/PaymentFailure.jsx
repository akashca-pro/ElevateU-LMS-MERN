
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useLocation, useNavigate } from "react-router-dom"

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const courseName = location.state
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. This could be due to insufficient funds, network issues, or your bank
          declining the transaction.
        </p>

        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>
            Your payment was not completed. No charges have been made to your account.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2" onClick={()=>navigate(`/explore/courses/${courseName}/checkout`,{replace : true})}>
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>

          <Button variant="outline" size="lg" className="gap-2" onClick={()=>navigate('/explore',{replace : true})}>
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure

