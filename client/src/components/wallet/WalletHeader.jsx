import { motion } from "framer-motion"
import { Wallet } from "lucide-react"

const WalletHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <div className="bg-primary/10 p-2 rounded-full">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-muted-foreground mt-1 ml-10"
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

export default WalletHeader

