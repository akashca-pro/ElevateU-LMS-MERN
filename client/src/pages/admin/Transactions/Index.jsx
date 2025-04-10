import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw, Download } from "lucide-react"
import TransactionTable from "./components/TransactionTable"
import TransactionModal from "./components/TransactionModal"
import { useLoadTransactionsQuery } from '@/services/adminApi/adminOrderApi.js'

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const { data, refetch } = useLoadTransactionsQuery(currentPage)

  const transactions = data?.data?.transactions
  console.log(data?.data?.transactions)

  // Filter transactions based on search query, tab, and date filter
  const filteredTransactions = transactions?.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction?.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.users.some(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      transaction?.course?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.order?.orderId.toLowerCase().includes(searchQuery.toLowerCase())

    // Tab filter
    const matchesTab = activeTab === "all" || transaction?.type.toLowerCase() === activeTab.toLowerCase()

    // Date filter (simplified for demo)
    let matchesDate = true
    const transactionDate = new Date(transaction.date)
    const now = new Date()

    if (dateFilter === "today") {
      const today = new Date()
      matchesDate = transactionDate.toDateString() === today.toDateString()
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7))
      matchesDate = transactionDate >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
      matchesDate = transactionDate >= monthAgo
    }

    return matchesSearch && matchesTab && matchesDate
  })

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    console.log(transaction)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage all transactions in your system.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>A complete list of all transactions processed through the platform.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                  onClick={()=>refetch()}
                  variant="outline" size="sm" className="h-8 gap-1">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[160px]">
                        <Filter className="h-3.5 w-3.5 mr-2" />
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="course_purchase">Purchases</TabsTrigger>
                    <TabsTrigger value="tutor_withdrawal">Payouts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <TransactionTable transactions={filteredTransactions} onViewDetails={handleViewDetails} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                  </TabsContent>
                  <TabsContent value="course_purchase" className="mt-4">
                    <TransactionTable transactions={filteredTransactions} onViewDetails={handleViewDetails} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                  </TabsContent>
                  <TabsContent value="tutor_withdrawal" className="mt-4">
                    <TransactionTable transactions={filteredTransactions} onViewDetails={handleViewDetails} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {selectedTransaction && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  )
}
