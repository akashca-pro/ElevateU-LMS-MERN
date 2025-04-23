import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Eye, Download, Share2, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
import { toast } from "sonner"

const CertificateActions = ({ certificate, onView, size = "default" }) => {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    // In a real app, this would trigger a download
    toast({
      title: "Certificate Downloaded",
      description: `${certificate.courseName} certificate has been downloaded.`,
    })
  }

  const handleCopyLink = () => {
    // In a real app, this would copy a shareable link
    navigator.clipboard.writeText(`https://example.com/certificates/${certificate.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Link Copied",
      description: "Certificate link has been copied to clipboard.",
    })
  }

  const handleShare = (platform) => {
    // In a real app, this would open the respective sharing dialog
    toast({
      title: `Shared on ${platform}`,
      description: `${certificate.courseName} certificate has been shared.`,
    })
  }

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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size={buttonSize} onClick={handleDownload} className="group">
                <Download className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span>Download</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download as PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size={buttonSize} className="group">
                    <Share2 className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                    <span>Share</span>
                  </Button>
                </motion.div>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share certificate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className="w-56 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Share Certificate</h4>

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]"
                onClick={() => handleShare("Twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2]"
                onClick={() => handleShare("Facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5]"
                onClick={() => handleShare("LinkedIn")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>

            <div className="pt-2 mt-2 border-t">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CertificateActions
