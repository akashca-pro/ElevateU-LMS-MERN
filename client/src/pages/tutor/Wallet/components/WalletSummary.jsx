import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Clock, ArrowUpRight, Copy, CheckCircle2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const WalletSummary = ({ walletData, onWithdraw }) => {

  const [copied, setCopied] = useState(false)

  const copyWalletId = () => {
    navigator.clipboard.writeText(walletData.walletId)
    setCopied(true)
    toast.info("Wallet ID copied",{
      description: "Wallet ID has been copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: 'INR',
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <motion.h2
                className="text-4xl font-bold mt-1"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                {formatCurrency(walletData.balance)}
              </motion.h2>
            </div>

            <Button
              onClick={onWithdraw}
              variant="secondary"
              className="gap-2 font-medium"
              disabled={walletData.balance <= 0}
            >
              <ArrowUpRight className="h-4 w-4" />
              Withdraw Funds
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{walletData.walletId}</p>
                  <button onClick={copyWalletId} className="text-gray-400 hover:text-primary transition-colors">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <Badge
                  variant="outline"
                  className="bg-green-500 text-white border-0 h-5 w-5 p-0 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-3 w-3" />
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{walletData.status ? 'Active' : 'Not-Active'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium">{walletData.currency}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(walletData.lastUpdated), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WalletSummary

