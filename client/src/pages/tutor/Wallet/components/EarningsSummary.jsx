import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

const EarningsSummary = ({ walletData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: walletData?.currency || 'INR',
    }).format(amount)
  }

  // Calculate net earnings
  const netEarnings = walletData?.totalEarnings - walletData?.totalWithdrawals

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                  {formatCurrency(walletData?.totalEarnings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Lifetime earnings from all sources</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                  {formatCurrency(walletData?.totalWithdrawals)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total amount withdrawn to date</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                <ArrowDownCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Earnings</p>
                <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                  {formatCurrency(netEarnings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total earnings minus withdrawals</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default EarningsSummary

