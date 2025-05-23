import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"

const OrderSummary = ({ pricing, courseFeatures,
  onSubmitPayment, acceptTerms, couponDiscount, children}) => {


  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Original Price</span>
            <span>₹{pricing?.subtotal}</span>
          </div>

          {Number.parseFloat(pricing?.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Course Discount</span>
              <span>-₹{pricing?.discount}</span>
            </div>
          )}

          {Number.parseFloat(couponDiscount?.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{couponDiscount?.discount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span>₹{pricing?.gst}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{couponDiscount?.finalAmount ? couponDiscount?.finalAmount : pricing?.total}</span>
          </div>

          {children}
        </div>
      </CardContent>

      <Separator />

      <CardContent className="pt-4">
        <div className="space-y-4">
          <Button className="w-full" size="lg" onClick={onSubmitPayment} disabled={ !acceptTerms}>
            Enroll Course
          </Button>

          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium">What's included:</p>
            <ul className="space-y-1">
              {courseFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderSummary