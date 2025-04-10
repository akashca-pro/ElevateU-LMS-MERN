import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import TransactionItem from "./TransactionItem"

const TransactionList = ({ transactions, loadMore }) => {
  const [expandedTransaction, setExpandedTransaction] = useState(null)
  const [page, setPage] = useState(1)
  const transactionsPerPage = 5

  // Get transactions for current page
  const paginatedTransactions = transactions?.slice((page - 1) * transactionsPerPage, page * transactionsPerPage)
  // Calculate total pages
  const totalPages = Math.ceil(transactions?.length / transactionsPerPage)

  // Handle pagination
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      setExpandedTransaction(null) // Close any expanded transaction
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      setExpandedTransaction(null) // Close any expanded transaction
    }
  }
 

  // Toggle transaction details
  const toggleTransaction = (id) => {
    setExpandedTransaction(expandedTransaction === id ? null : id)
  }

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="space-y-4">
      {transactions?.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <ArrowUpRight className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Your transaction history will appear here once you start earning or making withdrawals.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-3">
            <AnimatePresence mode="wait">
              {paginatedTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  isExpanded={expandedTransaction === transaction.id}
                  onToggle={() => toggleTransaction(transaction.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * transactionsPerPage + 1} to{" "}
                {Math.min(page * transactionsPerPage, transactions?.length)} of {transactions?.length} transactions
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
                  Previous
                </Button>
               {page === totalPages 
               ? <Button variant="outline" size="sm" onClick={()=>loadMore((prev)=>prev+=10)} >
                    Load more
               </Button>
               : <Button variant="outline" size="sm" onClick={nextPage} disabled={page === totalPages}>
                  Next
                </Button>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransactionList

