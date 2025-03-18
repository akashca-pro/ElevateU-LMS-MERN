import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Star,
  Clock,
  User,
  CreditCard,
  Wallet,
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  Lock,
  Info,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

const CourseEnrollment = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // Mock user data (would come from auth context in a real app)
  const user = {
    id: "user123",
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: "/placeholder.svg?height=100&width=100&text=JD",
  }

  // Fetch course data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock course data
      const mockCourse = {
        id: courseId,
        title: "Complete Web Development Bootcamp",
        description:
          "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more. This comprehensive course covers everything you need to become a full-stack developer.",
        tutor: {
          id: "tutor123",
          name: "Sarah Johnson",
          profileImage: "/placeholder.svg?height=100&width=100&text=SJ",
        },
        thumbnail: "/placeholder.svg?height=400&width=600&text=Web+Development+Bootcamp",
        rating: 4.8,
        reviewCount: 2547,
        price: 99.99,
        originalPrice: 199.99,
        discount: 50,
        duration: 42, // hours
        level: "Beginner to Advanced",
        hasCertification: true,
        modules: 12,
        lessons: 148,
        features: [
          "Lifetime Access",
          "Certificate of Completion",
          "Downloadable Resources",
          "Access on Mobile and TV",
          "Assignments & Projects",
          "Community Support",
        ],
      }

      setCourse(mockCourse)
      setLoading(false)
    }, 1000)
  }, [courseId])

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    // Simulate coupon validation
    if (couponCode.toUpperCase() === "SAVE20") {
      setCouponApplied(true)
      setCouponDiscount(20)
      toast({
        title: "Coupon Applied",
        description: "20% discount has been applied to your order",
        variant: "default",
      })
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is invalid or expired",
        variant: "destructive",
      })
    }
  }

  // Calculate pricing
  const calculatePricing = () => {
    if (!course) return { subtotal: 0, discount: 0, couponDiscount: 0, tax: 0, total: 0 }

    const subtotal = course.originalPrice
    const courseDiscount = subtotal * (course.discount / 100)
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
      setPaymentSuccess(true)

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Redirect to course after a delay
      setTimeout(() => {
        navigate(`/course/${courseId}`)
      }, 5000)
    }, 2000)
  }

  // Handle card detail changes
  const handleCardDetailChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(Number.parseFloat(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  const pricing = calculatePricing()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
              </div>
              <div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Enrollment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for enrolling in <span className="font-semibold">{course.title}</span>. Your payment has been
            processed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">ORD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium">${pricing.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {paymentMethod === "card"
                    ? "Credit Card"
                    : paymentMethod === "paypal"
                      ? "PayPal"
                      : paymentMethod === "gpay"
                        ? "Google Pay"
                        : "Wallet"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            You will be redirected to the course dashboard shortly. If not, click the button below.
          </p>

          <Button size="lg" className="gap-2" onClick={() => navigate(`/course/${courseId}`)}>
            Go to Course <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Complete Your Enrollment</h1>
        <p className="text-gray-600 mb-8">You're just one step away from accessing this course</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle>Course Details</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full aspect-video object-cover"
                      />
                      {course.hasCertification && (
                        <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                          <Award className="mr-1 h-3 w-3" />
                          Certificate
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{course.title}</h2>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{course.tutor.name}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{course.duration} hours</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(course.rating)}
                      <span className="text-sm text-gray-500">({course.reviewCount} reviews)</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-sm">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle>User Information</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    You'll be enrolled with the account information above. The course will be accessible immediately
                    after payment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>

              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    <div className="flex gap-1">
                      <img src="/placeholder.svg?height=24&width=36&text=Visa" alt="Visa" className="h-6" />
                      <img src="/placeholder.svg?height=24&width=36&text=MC" alt="Mastercard" className="h-6" />
                      <img src="/placeholder.svg?height=24&width=36&text=Amex" alt="American Express" className="h-6" />
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center">
                        <img src="/placeholder.svg?height=20&width=20&text=PP" alt="PayPal" className="h-5 w-5 mr-2" />
                        PayPal
                      </Label>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 ${paymentMethod === "gpay" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="gpay" id="gpay" />
                      <Label htmlFor="gpay" className="flex items-center">
                        <img
                          src="/placeholder.svg?height=20&width=20&text=G"
                          alt="Google Pay"
                          className="h-5 w-5 mr-2"
                        />
                        Google Pay / Apple Pay
                      </Label>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-lg border p-4 ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-gray-600" />
                        Wallet Balance
                      </Label>
                    </div>
                    <Badge variant="outline" className="bg-gray-100">
                      $0.00 Available
                    </Badge>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleCardDetailChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Lock className="h-4 w-4 mr-1" />
                      Your payment information is secure and encrypted
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="mt-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription>
                        You will be redirected to PayPal to complete your payment after clicking "Complete Enrollment".
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {paymentMethod === "gpay" && (
                  <div className="mt-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription>
                        You will be prompted to complete your payment with Google Pay or Apple Pay after clicking
                        "Complete Enrollment".
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="mt-6">
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your wallet balance is insufficient. Please add funds or choose another payment method.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="sticky top-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price</span>
                      <span>${pricing.subtotal}</span>
                    </div>

                    {Number.parseFloat(pricing.courseDiscount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Course Discount ({course.discount}%)</span>
                        <span>-${pricing.courseDiscount}</span>
                      </div>
                    )}

                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({couponDiscount}%)</span>
                        <span>-${pricing.couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span>${pricing.tax}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${pricing.total}</span>
                    </div>

                    {!couponApplied && (
                      <div className="pt-2">
                        <Label htmlFor="couponCode" className="text-sm">
                          Have a coupon?
                        </Label>
                        <div className="flex mt-1">
                          <Input
                            id="couponCode"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="rounded-r-none"
                          />
                          <Button onClick={handleApplyCoupon} className="rounded-l-none">
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Try "SAVE20" for 20% off</p>
                      </div>
                    )}
                  </div>
                </CardContent>

                <Separator />

                <CardContent className="pt-4">
                  <div className="space-y-4">
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

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmitPayment}
                      disabled={processingPayment || paymentMethod === "wallet"}
                    >
                      {processingPayment ? "Processing..." : "Complete Enrollment"}
                    </Button>

                    <div className="flex items-center justify-center text-xs text-gray-500 gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure Checkout</span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2">
                      <p className="font-medium">What's included:</p>
                      <ul className="space-y-1">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Alert className="bg-gray-50 border-gray-200">
                      <AlertDescription className="text-xs">
                        <strong>30-Day Money-Back Guarantee:</strong> If you're not satisfied with the course, you can
                        request a full refund within 30 days of purchase.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseEnrollment

