import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeftRight } from "lucide-react"

import WalletHeader from "@/components/wallet/WalletHeader"
import WalletSummary from "@/components/wallet/WalletSummary"
import WithdrawFunds from "@/components/wallet/WithdrawFunds"
import TransactionList from "@/components/wallet/TransactionList"
import EarningsSummary from "@/components/wallet/EarningsSummary"

import { useTutorLoadWalletDetailsQuery, useWithdrawRequestMutation, useLoadWithdrawRequestQuery } 
from '@/services/TutorApi/tutorWalletApi.js'
import { toast } from "sonner"

const WalletPage = () => {
  const withdrawRef = useRef()
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [withdrawRequest, setWithdrawRequest] = useState('')
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [transactionCount,setTransactionCount] = useState(20)
  const [activeTab, setActiveTab] = useState("all")

  const { data, isLoading } = useTutorLoadWalletDetailsQuery(transactionCount)
  const { data : fetchWithdrawRequest, refetch } = useLoadWithdrawRequestQuery()
  const [requestWithdraw] = useWithdrawRequestMutation()

  useEffect(()=>{

    const defaultWalletData = {
      balance: 0,
      walletId: '',
      totalEarnings: 0,
      totalWithdrawals: 0,
      lastUpdated: new Date().toISOString(),
      currency: "INR",
      status: false,
      paymentMethods: [
        { id: "pm1", type: "paypal", email: "user@example.com", isDefault: true },
        { id: "pm2", type: "bank", accountNumber: "****6789", isDefault: false },
      ],
    }


    if(data?.data?.walletDetails){
      setWalletData(data?.data?.walletDetails)
    }else{
      setWalletData(defaultWalletData)
    }

    if(data?.data?.transactions && data?.data?.transactions.length > 0 ){
      setTransactions(data?.data?.transactions)
    }
    
    if(fetchWithdrawRequest?.success){
      setWithdrawRequest(fetchWithdrawRequest?.data)
    }

  },[data, fetchWithdrawRequest])

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === "all") return transactions
    if (activeTab === "credits") return transactions.filter((t) => t.type === "credit")
    if (activeTab === "debits") return transactions.filter((t) => t.type === "debit")
    if(activeTab === "withdraw-request") return transactions.filter((t)=>t.type === 'withdraw-request')
    return transactions
  }

  // Handle withdrawal request
  const handleWithdrawal = async(data) => {
    try {
      await requestWithdraw({formData : data}).unwrap()
      withdrawRef.current?.triggerSuccess();
      refetch();
    } catch (error) {
      console.log(error)
      withdrawRef.current?.triggerFailure()
    }finally{
      setTimeout(() => {
        setIsWithdrawModalOpen(false) 
      }, 2000)
    }
  }

  const handleShowWithdrawRequest = () => {
     if(withdrawRequest){
      toast.info('Request Pending',{
        description : withdrawRequest
      })
     }else{
      setIsWithdrawModalOpen(true)
     }
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

  if (isLoading) {
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
          <WalletSummary walletData={walletData} onWithdraw={handleShowWithdrawRequest} />
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

          <TransactionList transactions={getFilteredTransactions()}
           loadMore={setTransactionCount}/>

        </motion.div>
      </motion.div>

      {/* Withdraw Funds Modal */}
      <WithdrawFunds
        ref={withdrawRef}
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdrawal}
        maxAmount={walletData?.balance}
        paymentMethods={walletData?.paymentMethods}
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

