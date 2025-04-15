import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { toast } from "sonner"
import {
  useUserGetPricingQuery,
  useUserApplyCouponMutation,
  useUserRemoveAppliedCouponMutation,
  useUserFetchAppliedCouponQuery,
  useUserCreateOrderMutation,
  useUserEnrollCourseMutation,
  useUserLoadCartQuery,
} from "@/services/userApi/userCourseApi.js"
import { useRazorpayPayment } from "@/services/razorpay.js"
import { motion } from "framer-motion"

import CourseDetails from "./components/CourseDetails"
import UserInformation from "./components/UserInformation"
import RazorPayPayment from "./components/RazorPayPayment"
import OrderSummary from "./components/OrderSummary"
import CouponForm from "./components/CouponForm"
import { formatUrl } from "@/utils/formatUrls"
import { useSelect } from "@/hooks/useSelect"
import EmptyCartComponent from "@/components/FallbackUI/EmptyCartComponent"
import { CourseEnrollmentSkeleton } from "@/components/Skeletons/CourseEnrollmentSkeleton"

const CourseEnrollment = () => {
  const { course : courseId } = useSelect()
  console.log(courseId)
  const navigate = useNavigate()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(null)
  const [user, setUser] = useState(null)
  const [course, setCourse] = useState(null)
  const { data: cartDetails, error, isLoading } = useUserLoadCartQuery(courseId, { refetchOnMountOrArgChange: true })

  const { data: couponDetails } = useUserFetchAppliedCouponQuery(courseId, { refetchOnMountOrArgChange: true, })

  useEffect(() => {
    if (cartDetails?.data) {
      setUser(cartDetails.data.user)
      setCourse(cartDetails.data.course)
    } else if (error?.data) {
      toast.error(error?.data)
    }
  }, [cartDetails])

  const decodedCourseName = course ? formatUrl(course.title) : ""

  useEffect(() => {
    if (couponDetails?.data) {
      setCouponDiscount(couponDetails?.data)
      setCouponApplied(true)
    }
  }, [couponDetails?.data])

  const { data: details } = useUserGetPricingQuery(course?._id)

  const pricing = details?.data

  const [applyCoupon] = useUserApplyCouponMutation()

  const [removeAppliedCoupon] = useUserRemoveAppliedCouponMutation()

  const [createOrder] = useUserCreateOrderMutation()

  const { handlePayment } = useRazorpayPayment()

  const [enrollCourse] = useUserEnrollCourseMutation()

  const features = [
    "Lifetime Access",
    "Certificate of Completion",
    "Downloadable Resources",
    "Access on Mobile and TV",
    "Assignments & Projects",
    "Community Support",
  ]

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Error", {
        description: "Please enter a coupon code",
      })
      return
    }

    const toastId = toast.loading("Applying coupon . . .")

    const details = {
      courseId: course._id,
      couponCode: couponCode,
    }

    try {
      const response = await applyCoupon({ ...details }).unwrap()
      toast.success(response?.message, { id: toastId })
      setCouponApplied(true)
      setCouponDiscount(response?.data)
    } catch (error) {
      console.log(error)
      toast.error("Applying coupon Failed", {
        description: error?.data?.message,
        id: toastId,
      })
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      await removeAppliedCoupon(course._id).unwrap()
      setCouponApplied(false)
      setCouponDiscount(null)
    } catch (error) {
      console.Consolelog(error)
    }
  }

  // Handle payment submission
  const handleSubmitPayment = async () => {
    const courseId = course?._id
    const userData = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
    }
    try {
      const responseOrderCreation = await createOrder({ courseId, userData })
      const orderData = responseOrderCreation?.data?.data

      const response = await handlePayment(orderData)
      if (response.success) {
        await enrollCourse({ courseId }).unwrap()
        navigate(`/explore/courses/${decodedCourseName}/checkout/payment-success`, {
          state: {
            orderId: response.paymentDetails?.orderId,
            transactionId: response.paymentDetails?.transactionId,
            amountPaid: response.paymentDetails?.amountPaid,
            courseId,
          },
        })
      } else {
        navigate(`/explore/courses/${decodedCourseName}/checkout/payment-failed`, { state: decodedCourseName })
      }
    } catch (error) {
      console.log(error)
      toast.error("Error", {
        description: error?.data?.message,
      })
    }
  }
  return (
    <>
      {" "}
      {isLoading ? (
        <CourseEnrollmentSkeleton />
      ) : course ? (
        <motion.div
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Complete Your Enrollment
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-8"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              You're just one step away from accessing this course
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Course Details */}
              <motion.div
                className="md:col-span-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CourseDetails course={course} />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <UserInformation user={user} />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="mb-8">
                    <RazorPayPayment />

                    <Separator />

                    <div className="p-4">
                      <motion.div
                        className="flex items-start space-x-2"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
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
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                        <Alert className="mt-4 bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            After clicking "Complete Enrollment", you will be redirected to RazorPay to complete your
                            payment securely.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Right Column - Order Summary */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="sticky top-4">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <OrderSummary
                      acceptTerms={acceptTerms}
                      pricing={pricing}
                      couponDiscount={couponDiscount}
                      courseFeatures={features}
                      onSubmitPayment={handleSubmitPayment}
                    >
                      <CouponForm
                        couponApplied={couponApplied}
                        couponCode={couponDiscount?.couponCode || couponCode}
                        setCouponCode={setCouponCode}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                      />

                      <motion.div
                        className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            duration: 2,
                          }}
                        >
                          <Shield className="h-3 w-3" />
                        </motion.div>
                        <span>Secure Checkout</span>
                      </motion.div>
                    </OrderSummary>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <EmptyCartComponent />
      )}{" "}
    </>
  )
}

export default CourseEnrollment
