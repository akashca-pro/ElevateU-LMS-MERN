import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import OtpInput from "./OtpInput"
import { toast } from "sonner"

const OtpVerificationDialog = ({
  isOpen,
  onClose,
  useVerifyOtp,
  email,
  length = 6,
  expiresIn = 1, // seconds
  useResendOtp,
  resetForm
}) => {
  const [allowClose, setAllowClose] = useState(false)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(expiresIn)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen, timeLeft])

  useEffect(() => {
    if (isOpen) {
      // Reset states when dialog opens
      setOtp("")
      setError("")
      setIsLoading(false)
      setIsSuccess(false)
      setTimeLeft(expiresIn)
    }
  }, [isOpen, expiresIn])

  const handleVerify = async () => {
    if (otp.length !== length) {
      setError(`Please enter all ${length} digits`)
      return
    }

    if (timeLeft === 0) {
      setError("OTP has expired. Please request a new one.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await useVerifyOtp({otp,email}).unwrap()
      toast.success('Update Email Success',{
        description : `Email is updated to ${email}`
      })
      setAllowClose(true)
      resetForm()
      onClose()
    } catch (error) {
      console.log(error)
      setError(error?.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async() => {

    try {
      const toastId = toast.loading('Please wait . . . ',{
        description : 'Sending otp'
      })
      await useResendOtp({email}).unwrap()
      toast.success('Sending OTP success',{
        description : `New OTP sent to ${email}`,
        id : toastId
      })
      setTimeLeft(expiresIn)
      setError("")
    } catch (error) {
      toast.error('Error',{
        description : 'Resend otp failed'
      })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && allowClose) {
            onClose()
          }
        }}
      >
      <DialogContent className="sm:max-w-md overflow-hidden border-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative backdrop-blur-md bg-white/80 dark:bg-gray-950/80 rounded-lg shadow-lg p-1"
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 z-0" />

          <div className="relative z-10">
            <DialogHeader className="pt-6 px-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Verify OTP
                </DialogTitle>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <DialogDescription className="text-center pt-2">
                  Please enter the {length}-digit code sent to {email}
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  length={length}
                  disabled={isLoading || isSuccess}
                  error={!!error}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center text-red-500 text-sm gap-1.5"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {timeLeft > 0 ? (
                    <>
                      <span>Code expires in</span>
                      <span className="font-medium text-primary">{formatTime(timeLeft)}</span>
                    </>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">OTP has expired</span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={handleVerify}
                  disabled={otp.length !== length || isLoading || isSuccess || timeLeft === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </motion.div>
            </div>

            <DialogFooter className="px-6 pb-6 flex flex-col sm:flex-row gap-2 sm:gap-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-center w-full"
              >
                <Button
                  variant="link"
                  className="text-sm text-gray-500 hover:text-primary"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || isLoading}
                >
                  {timeLeft > 0 ? "Resend code" : "Resend code"}
                </Button>
              </motion.div>
            </DialogFooter>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default OtpVerificationDialog
