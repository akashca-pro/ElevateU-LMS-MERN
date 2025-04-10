import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Copy, CheckCircle, Clock } from "lucide-react"
import { formatCurrency, formatDate } from "../utils"
import { useState } from "react"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function OrderInfoCard({ order }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate savings if coupon was applied
  const savings = order?.couponApplied ? order.originalPrice - order.finalPrice : 0

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-semibold text-lg">Order Information</h3>
                <p className="text-sm text-muted-foreground">Complete details about this order</p>
              </div>

              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                Download Invoice
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{order.orderId}</span>
                    <button
                      onClick={() => copyToClipboard(order.orderId)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(order.date)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Razorpay ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{order.razorpayId}</span>
                    <button
                      onClick={() => copyToClipboard(order.razorpayId)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-green-500"
                        : order.status === "pending"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {order.status === "completed" ? (
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 mr-1" />
                    )}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span className="font-medium">{formatCurrency(order.originalPrice)}</span>
                </div>

                {order.couponApplied && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coupon Applied:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {order.couponCode} ({order.discountPercentage}% OFF)
                    </Badge>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Price:</span>
                  <span className="font-bold">{formatCurrency(order.finalPrice)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Order Summary</h4>
                  <p className="text-sm text-muted-foreground">Transaction details</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatCurrency(order.finalPrice)}</div>
                  {savings > 0 && <div className="text-xs text-green-600">You saved {formatCurrency(savings)}</div>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
