import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Copy,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const TransactionItem = ({ transaction, isExpanded, onToggle }) => {

    const [copied, setCopied] = useState(false)

    const copyWalletId = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(transaction?.reference)
        setCopied(true)
        toast.info("Reference ID copied")
        setTimeout(() => setCopied(false), 2000)
    }


  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount))
  }

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a")
  }

  // Get transaction type icon
  const getTransactionIcon = () => {
    if (transaction?.type === "credit") {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />
    } else {
      return <ArrowUpRight className="h-5 w-5 text-amber-500" />
    }
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (transaction?.status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 gap-1"
          >
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {transaction.status}
          </Badge>
        )
    }
  }

  // Get purpose label
  const getPurposeLabel = () => {
    const purposeMap = {
      course_purchase: "Course Sale",
      affiliate_commission: "Affiliate Commission",
      refund_reversal: "Refund Reversal",
      withdrawal: "Withdrawal",
      refund: "Refund",
    }

    return purposeMap[transaction?.purpose] || transaction?.purpose
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} layout>
      <Card
        className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
          isExpanded ? "bg-accent/50" : ""
        }`}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  transaction?.type === "credit"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-amber-100 dark:bg-amber-900/20"
                }`}
              >
                {getTransactionIcon()}
              </div>

              <div>
                <p className="font-medium">{getPurposeLabel()}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transaction?.type === "credit"
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {transaction?.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction?.amount)}
                </p>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>

              <div className="text-muted-foreground">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Description</p>
                    <p>{transaction?.description}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">Reference ID</p>
                    <div className="flex items-center gap-2">
                    <p className="font-mono">{transaction?.reference}</p>
                    <button onClick={copyWalletId} className="text-gray-400 hover:text-primary transition-colors">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  </div>
                  </div>

                 { transaction?.purpose === 'course_purchase' && <div>
                    <p className="text-muted-foreground mb-1">Platform Fee</p>
                    <p className="font-mono">{transaction?.platformFee}</p>
                  </div>}

                </div>

                <div className="mt-4 flex justify-end">
                  <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-accent">
                    <ExternalLink className="h-3 w-3" />
                    View Receipt
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TransactionItem

