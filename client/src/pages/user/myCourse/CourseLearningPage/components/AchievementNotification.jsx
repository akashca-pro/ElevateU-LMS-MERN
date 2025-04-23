import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, X } from "lucide-react"

const AchievementNotification = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
    >
      <Card className="border-0 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-2">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
              <p>{message}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AchievementNotification
