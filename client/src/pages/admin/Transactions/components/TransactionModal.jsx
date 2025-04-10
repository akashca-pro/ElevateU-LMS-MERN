import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Share2 } from "lucide-react"
import UserInfoCard from "./UserInfoCard"
import CourseInfoCard from "./CourseInfoCard"
import OrderInfoCard from "./OrderInfoCard"
import { formatDate } from "../utils"

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

export default function TransactionModal({ isOpen, onClose, transaction }) {
  // Get transaction status badge
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
            <motion.div initial="hidden" animate="visible" exit="hidden" variants={contentVariants}>
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <DialogTitle className="text-xl">Transaction Details</DialogTitle>
                    <DialogDescription className="mt-1">
                      Complete information about transaction {transaction.id}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(transaction.status)}</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Date:</span> {formatDate(transaction.date, true)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Printer className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />
              </DialogHeader>

              <div className="px-6 pb-6">
                <Tabs defaultValue="users">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="users">User Details</TabsTrigger>
                    <TabsTrigger value="course">Course Details</TabsTrigger>
                    <TabsTrigger value="order">Order Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="users" className="mt-0">
                    <div className="space-y-4">
                      {transaction.users.map((user, index) => (
                        <UserInfoCard key={index} user={user} role={index === 0 ? "Seller" : "Buyer"} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="course" className="mt-0">
                    <CourseInfoCard course={transaction.course} />
                  </TabsContent>

                  <TabsContent value="order" className="mt-0">
                    <OrderInfoCard order={transaction.order} />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
