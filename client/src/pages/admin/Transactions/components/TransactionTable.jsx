import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, AlertCircle } from "lucide-react"
import { formatCurrency, formatDate } from "../utils"

export default function TransactionTable({ transactions, onViewDetails, setCurrentPage ,currentPage}) {
  const itemsPerPage = 10

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage)

  // Get transaction type badge
  const getTransactionBadge = (type) => {
    switch (type.toLowerCase()) {
      case "purchase":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Purchase
          </Badge>
        )
      case "refund":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Refund
          </Badge>
        )
      case "payout":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Payout
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No transactions found</h3>
        <p className="text-muted-foreground mt-1 max-w-md">
          There are no transactions matching your current filters. Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedTransactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2 overflow-hidden">
                      {transaction.users.slice(0, 3).map((user, index) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={user.profileImage} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {transaction.users.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{transaction.users.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(transaction)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1
              // Show limited page numbers with ellipsis
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <PaginationItem key={page}>...</PaginationItem>
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
