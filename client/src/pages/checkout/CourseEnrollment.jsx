import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { toast } from "sonner"
import { useUserGetPricingQuery, useUserApplyCouponMutation,
   useUserRemoveAppliedCouponMutation, useUserFetchAppliedCouponQuery,
   useUserCreateOrderMutation, useUserEnrollCourseMutation, useUserLoadCartQuery
  } from '@/services/userApi/userCourseApi.js'
import { useRazorpayPayment } from '@/services/razorpay.js'

import CourseDetails from "./components/CourseDetails"
import UserInformation from "./components/UserInformation"
import RazorPayPayment from "./components/RazorPayPayment"
import OrderSummary from "./components/OrderSummary"
import CouponForm from "./components/CouponForm"
import { formatUrl } from "@/utils/formatUrls"
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner"
import ErrorComponent from "@/components/FallbackUI/ErrorComponent"
import EmptyCartComponent from "@/components/FallbackUI/EmptyCartComponent"

const CourseEnrollment = () => {
  const navigate = useNavigate()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(null)
  const [user,setUser] = useState(null)
  const [course,setCourse] = useState(null)
  const { data : cartDetails, isFetching, isLoading } = useUserLoadCartQuery(undefined,{refetchOnMountOrArgChange : true})


  useEffect(() => {
    if (cartDetails?.data) {
      setUser(cartDetails.data.user);
      setCourse(cartDetails.data.course);
    }
  }, [cartDetails]);

  
  
const { data: couponDetails } = useUserFetchAppliedCouponQuery(course?._id, {
  skip: !course?._id, // Prevents query execution if course._id is missing
});

  const appliedCoupon = couponDetails?.data


  const decodedCourseName = course ? formatUrl(course.title) : "";

  useEffect(()=>{

    if(appliedCoupon){
      setCouponDiscount(appliedCoupon)
      setCouponApplied(true)
    }
  },[appliedCoupon])

  const { data : details } = useUserGetPricingQuery(course?._id)

  const pricing = details?.data

  const [applyCoupon] = useUserApplyCouponMutation()

  const [removeAppliedCoupon] = useUserRemoveAppliedCouponMutation()

  const [createOrder] = useUserCreateOrderMutation()

  const { handlePayment } = useRazorpayPayment()

  const [enrollCourse] = useUserEnrollCourseMutation()


  const  features = [
    "Lifetime Access",
    "Certificate of Completion",
    "Downloadable Resources",
    "Access on Mobile and TV",
    "Assignments & Projects",
    "Community Support",
  ]


  // Handle coupon application
  const handleApplyCoupon = async() => {
    if (!couponCode.trim()) {
      toast.error('Error',{
        description : 'Please enter a coupon code',
      })
      return
    }

    const toastId = toast.loading('Applying coupon . . .')

    const details = {
      courseId : course._id,
      couponCode : couponCode,
    }

    try {
      const response = await applyCoupon({ ...details }).unwrap()
      console.log(response)
      toast.success(response?.message,{id : toastId})
      setCouponApplied(true);
      setCouponDiscount(response?.data)
    } catch (error) {
      console.log(error)
      toast.error('Applying coupon Failed',{
        description : error?.data?.message,
        id : toastId
      })
    }

  }

  const handleRemoveCoupon = async() =>{
      setCouponApplied(false)
      setCouponDiscount(null)
      try {
        await removeAppliedCoupon(course._id).unwrap()
      } catch (error) {
        console.Consolelog(error)
      }
  }

  // Handle payment submission
  const handleSubmitPayment = async() => {
   

    const courseId = course?._id
    const userData = {
      _id : user?._id,
      name : user?.name,
      email : user?.email,
      phone : user?.phone
    }
    try {
        const responseOrderCreation = await createOrder({courseId, userData})
        const orderData = responseOrderCreation?.data?.data
        console.log(orderData)

        const response = await handlePayment(orderData);
        if(response.success){
          await enrollCourse({courseId}).unwrap()
          navigate(`/explore/courses/${decodedCourseName}/checkout/payment-success`,{state : {
            orderId : response.paymentDetails?.orderId,
            transactionId : response.paymentDetails?.transactionId,
            amountPaid : response.paymentDetails?.amountPaid,
            courseTitle : course?.title
          }})
        }else{
          toast.error(response.message)
        }
    } catch (error) {
      console.log(error)
      toast.error('Error',{
        description : error?.data?.message
      })
    }

  }
  return (<> {isLoading ? <LoadingSpinner/>  : course ? 
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
              <RazorPayPayment  />

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
                acceptTerms={acceptTerms}
                pricing={pricing}
                couponDiscount={couponDiscount}
                courseFeatures={features}
                onSubmitPayment={handleSubmitPayment}
              >
                
                  <CouponForm couponApplied={couponApplied} couponCode={couponDiscount?.couponCode || couponCode} 
                  setCouponCode={setCouponCode} onApplyCoupon={handleApplyCoupon}
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
  : <EmptyCartComponent/> } </>)
}

export default CourseEnrollment

