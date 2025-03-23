import { CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const RazorPayPayment = () => {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Secure payment via RazorPay</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4 border-primary bg-primary/5">
          <div className="flex items-center space-x-3">
            <img src="/razorpay.svg" alt="PayPal" className="h-5 w-25" />
          </div>
        </div>

        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription> 
              "You will be redirected to Razorpay to complete your payment securely.
          </AlertDescription>
        </Alert>
      </CardContent>
    </>
  )
}

export default RazorPayPayment

