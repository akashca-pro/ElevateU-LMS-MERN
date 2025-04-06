import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowUpRight, DollarSign, CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const WithdrawFunds = ({ isOpen, onClose, onWithdraw, maxAmount, paymentMethods }) => {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setErrors({})
      setStep(1)
      setIsProcessing(false)
      setIsSuccess(false)

      // Set default payment method
      if (paymentMethods && paymentMethods.length > 0) {
        const defaultMethod = paymentMethods.find((m) => m.isDefault) || paymentMethods[0]
        setSelectedMethod(defaultMethod.id)
      }
    }
  }, [isOpen, paymentMethods])

  const validateForm = () => {
    const newErrors = {}

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number.parseFloat(amount))) {
      newErrors.amount = "Amount must be a valid number"
    } else if (Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than zero"
    } else if (Number.parseFloat(amount) > maxAmount) {
      newErrors.amount = `Amount cannot exceed your balance of ${maxAmount}`
    }

    if (!selectedMethod) {
      newErrors.method = "Please select a payment method"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setStep(2)
    }
  }

  const handleConfirm = () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      // After showing success message, submit the data
      setTimeout(() => {
        const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)
        const methodName =
          selectedPaymentMethod.type === "paypal"
            ? `PayPal (${selectedPaymentMethod.email})`
            : `Bank Account (${selectedPaymentMethod.accountNumber})`

        onWithdraw({
          amount: Number.parseFloat(amount),
          method: methodName,
          methodId: selectedMethod,
          timestamp: new Date().toISOString(),
        })
      }, 1500)
    }, 2000)
  }

  const formatCurrency = (value) => {
    if (!value) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getPaymentMethodLabel = (method) => {
    if (method.type === "paypal") {
      return `PayPal (${method.email})`
    } else if (method.type === "bank") {
      return `Bank Account (${method.accountNumber})`
    }
    return method.type
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Request a withdrawal from your wallet balance to your preferred payment method.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-9"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                <p className="text-xs text-muted-foreground">Available balance: {formatCurrency(maxAmount)}</p>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-2 border rounded-md p-3 transition-colors ${
                        selectedMethod === method.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4 text-primary" />
                        {getPaymentMethodLabel(method)}
                        {method.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.method && <p className="text-sm text-red-500">{errors.method}</p>}
              </div>

              <Alert
                variant="outline"
                className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Withdrawals typically process within 1-3 business days depending on your payment method.
                </AlertDescription>
              </Alert>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </motion.form>
          )}

          {step === 2 && !isProcessing && !isSuccess && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 py-4"
            >
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Confirm Withdrawal Details</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Amount:</div>
                    <div className="font-medium">{formatCurrency(Number.parseFloat(amount))}</div>

                    <div className="text-muted-foreground">Payment Method:</div>
                    <div className="font-medium">
                      {getPaymentMethodLabel(paymentMethods.find((m) => m.id === selectedMethod))}
                    </div>

                    <div className="text-muted-foreground">Processing Time:</div>
                    <div>1-3 business days</div>
                  </div>
                </div>

                <Alert
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>By confirming, you agree to our withdrawal terms and conditions.</AlertDescription>
                </Alert>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleConfirm}>Confirm Withdrawal</Button>
              </DialogFooter>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium">Processing your withdrawal</h3>
              <p className="text-muted-foreground text-center mt-2">Please wait while we process your request...</p>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium">Withdrawal Requested</h3>
              <p className="text-muted-foreground text-center mt-2 max-w-xs">
                Your withdrawal request for {formatCurrency(Number.parseFloat(amount))} has been submitted successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawFunds

