import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye} from "lucide-react"


const CertificateActions = ({ onView, size = "default" }) => {

  const buttonSize = size === "small" ? "sm" : "default"

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size={buttonSize} onClick={onView} className="group">
                <Eye className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span>View</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>View certificate</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default CertificateActions
