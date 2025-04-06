import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeftRight } from "lucide-react"

import WalletHeader from "./components/WalletHeader"
import WalletSummary from "./components/WalletSummary"
import WithdrawFunds from "./components/WithdrawFunds"
import TransactionList from "./components/TransactionList"
import EarningsSummary from "./components/EarningsSummary"

const WalletPage = () => {
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock wallet data
          const mockWalletData = {
            balance: 1250.75,
            walletId: "W-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
            totalEarnings: 3450.25,
            totalWithdrawals: 2199.5,
            lastUpdated: new Date().toISOString(),
            currency: "USD",
            status: "active",
            paymentMethods: [
              { id: "pm1", type: "paypal", email: "user@example.com", isDefault: true },
              { id: "pm2", type: "bank", accountNumber: "****6789", isDefault: false },
            ],
          }

          // Mock transactions
          const mockTransactions = Array.from({ length: 20 }, (_, i) => {
            const isCredit = Math.random() > 0.3
            const types = isCredit
              ? ["course_sale", "affiliate_commission", "refund_reversal"]
              : ["withdrawal", "refund", "platform_fee"]

            const amount = isCredit ? (Math.random() * 500 + 50).toFixed(2) : (Math.random() * 300 + 20).toFixed(2)

            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 30))

            const statuses = ["completed", "pending", "processing"]
            const status = statuses[Math.floor(Math.random() * statuses.length)]

            return {
              id: `trx-${i + 1}`,
              date: date.toISOString(),
              amount: Number.parseFloat(amount),
              type: isCredit ? "credit" : "debit",
              purpose: types[Math.floor(Math.random() * types.length)],
              status: status,
              description: isCredit
                ? `Payment received for ${["Web Development", "UX Design", "Data Science", "Mobile App Development"][Math.floor(Math.random() * 4)]} course`
                : `Withdrawal to ${Math.random() > 0.5 ? "PayPal" : "Bank Account"}`,
              reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            }
          })

          // Sort transactions by date (newest first)
          mockTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))

          setWalletData(mockWalletData)
          setTransactions(mockTransactions)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === "all") return transactions
    if (activeTab === "credits") return transactions.filter((t) => t.type === "credit")
    if (activeTab === "debits") return transactions.filter((t) => t.type === "debit")
    return transactions
  }

  // Handle withdrawal request
  const handleWithdrawal = (data) => {
    console.log("Withdrawal requested:", data)
    // In a real app, you would send this to your API

    // Add the withdrawal to transactions
    const newTransaction = {
      id: `trx-${Math.random().toString(36).substring(2, 10)}`,
      date: new Date().toISOString(),
      amount: Number.parseFloat(data.amount),
      type: "debit",
      purpose: "withdrawal",
      status: "pending",
      description: `Withdrawal to ${data.method}`,
      reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    }

    setTransactions([newTransaction, ...transactions])

    // Update wallet balance
    setWalletData({
      ...walletData,
      balance: walletData.balance - Number.parseFloat(data.amount),
      totalWithdrawals: walletData.totalWithdrawals + Number.parseFloat(data.amount),
      lastUpdated: new Date().toISOString(),
    })

    setIsWithdrawModalOpen(false)
  }

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

  if (loading) {
    return <WalletPageSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Wallet Header */}
        <motion.div variants={itemVariants}>
          <WalletHeader title="My Wallet" subtitle="Manage your earnings and withdrawals" />
        </motion.div>

        {/* Wallet Summary */}
        <motion.div variants={itemVariants}>
          <WalletSummary walletData={walletData} onWithdraw={() => setIsWithdrawModalOpen(true)} />
        </motion.div>

        {/* Earnings Summary Cards */}
        <motion.div variants={itemVariants}>
          <EarningsSummary walletData={walletData} />
        </motion.div>

        {/* Transactions Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Transaction History
            </h2>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all" className="text-sm">
                  All Transactions
                </TabsTrigger>
                <TabsTrigger value="credits" className="text-sm">
                  Credits
                </TabsTrigger>
                <TabsTrigger value="debits" className="text-sm">
                  Debits
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TransactionList transactions={getFilteredTransactions()} />
        </motion.div>
      </motion.div>

      {/* Withdraw Funds Modal */}
      <WithdrawFunds
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdrawal}
        maxAmount={walletData.balance}
        paymentMethods={walletData.paymentMethods}
      />
    </div>
  )
}

// Loading skeleton
const WalletPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Wallet Summary Skeleton */}
      <Skeleton className="h-[200px] w-full rounded-xl" />

      {/* Earnings Summary Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      {/* Transactions Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WalletPage

