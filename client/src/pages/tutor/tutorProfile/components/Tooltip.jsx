import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {ShieldAlert} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipVerified() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Label>
          <ShieldAlert stroke="black" fill="#FFF788" />
          </Label>
        </TooltipTrigger>
        <TooltipContent className="bg-blue-500 text-white"  >
          <p>Verification required</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
