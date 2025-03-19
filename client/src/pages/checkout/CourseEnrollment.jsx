import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { toast } from "sonner"
import { useUserLoadProfileQuery } from '@/services/userApi/userProfileApi'

import CourseDetails from "./CourseDetails"
import UserInformation from "./UserInformation"
import RazorPayPayment from "./RazorPayPayment"
import OrderSummary from "./OrderSummary"
import CouponForm from "./CouponForm"
import PaymentSuccess from "./PaymentSuccess"
import PaymentFailure from "./PaymentFailure"
import LoadingSkeleton from "./LoadingSkeleton"

const CourseEnrollment = () => {
  const { courseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null, 'success', 'failure'
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const { data : userDetails } = useUserLoadProfileQuery()
  const user = userDetails?.data
  const course = location.state

  // Mock user data (would come from auth context in a real app)
  // const user = {
  //   id: "user123",
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   profileImage: "/placeholder.svg?height=100&width=100&text=JD",
  // }

  const  features = [
    "Lifetime Access",
    "Certificate of Completion",
    "Downloadable Resources",
    "Access on Mobile and TV",
    "Assignments & Projects",
    "Community Support",
  ]


  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Error',{
        description : 'Please enter a coupon code',
      })
      return
    }

    // Simulate coupon validation
    if (couponCode.toUpperCase() === "SAVE20") {
      setCouponApplied(true)
      setCouponDiscount(20)
      toast.success("Coupon Applied", {
        description: "20% discount has been applied to your order",
      });
    } else {
      toast.error('Invalid Coupon',{
        description : 'The coupon code you entered is invalid or expired',
      })
    }
  }

  const handleRemoveCoupon = () =>{
      setCouponApplied(false)
      setCouponDiscount(0)
  }

  // Calculate pricing
  const calculatePricing = () => {
    if (!course) return { subtotal: 0, discount: 0, couponDiscount: 0, tax: 0, total: 0 }

    const subtotal = course?.price
    const courseDiscount = subtotal * (course?.discount / 100)
    const couponDiscountAmount = couponApplied ? (subtotal - courseDiscount) * (couponDiscount / 100) : 0
    const priceAfterDiscounts = subtotal - courseDiscount - couponDiscountAmount
    const tax = priceAfterDiscounts * 0.05 // 5% tax
    const total = priceAfterDiscounts + tax

    return {
      subtotal: subtotal.toFixed(2),
      courseDiscount: courseDiscount.toFixed(2),
      couponDiscount: couponDiscountAmount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    }
  }

  // Handle payment submission
  const handleSubmitPayment = () => {
    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed",
        variant: "destructive",
      })
      return
    }

    setProcessingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false)

      // Simulate success (90% chance) or failure (10% chance)
      const isSuccess = Math.random() < 0.9
      setPaymentStatus(isSuccess ? "success" : "failure")

      // Scroll to top to show success/failure message
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Redirect to course after a delay if payment was successful
      if (isSuccess) {
        setTimeout(() => {
          navigate(`/course/${courseId}`)
        }, 5000)
      }
    }, 2000)
  }

  const pricing = calculatePricing()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (paymentStatus === "success") {
    return (
      <PaymentSuccess
        course={course}
        pricing={pricing}
        orderId={Math.random().toString(36).substring(2, 10).toUpperCase()}
        onNavigate={() => navigate(`/course/${courseId}`)}
      />
    )
  }

  if (paymentStatus === "failure") {
    return <PaymentFailure onRetry={() => setPaymentStatus(null)} onCancel={() => navigate("/courses")} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Complete Your Enrollment</h1>
        <p className="text-gray-600 mb-8">You're just one step away from accessing this course</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="md:col-span-2">
            <CourseDetails course={course} />

            <UserInformation user={user} />

            <Card className="mb-8">
              <RazorPayPayment processingPayment={processingPayment} />

              <Separator />

              <div className="p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                    <p className="text-xs text-gray-500">
                      By enrolling, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>

                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    After clicking "Complete Enrollment", you will be redirected to RazorPay to complete your payment
                    securely.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="sticky top-4">
              <OrderSummary
                pricing={pricing}
                courseFeatures={features}
                processingPayment={processingPayment}
                onSubmitPayment={handleSubmitPayment}
              >
                
                  <CouponForm couponApplied={couponApplied} couponCode={couponCode} setCouponCode={setCouponCode} onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                   />
            

                <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-4">
                  <Shield className="h-3 w-3" />
                  <span>Secure Checkout</span>
                </div>
              </OrderSummary>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseEnrollment

