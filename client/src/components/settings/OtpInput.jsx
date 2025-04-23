import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

const OtpInput = ({ value = "", onChange, length = 6, disabled = false, error = false }) => {
  const inputRefs = useRef([])

  // Initialize the array of refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Focus the first input when component mounts
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  const handleChange = (e, index) => {
    const newValue = e.target.value

    // Only allow numbers
    if (newValue && !/^\d+$/.test(newValue)) {
      return
    }

    // Take only the last character if multiple characters are pasted
    const digit = newValue.slice(-1)

    // Create a new OTP string
    const newOtp = value.split("")
    newOtp[index] = digit
    const updatedOtp = newOtp.join("")

    onChange(updatedOtp)

    // Move focus to next input if a digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty and backspace is pressed, move focus to previous input
        inputRefs.current[index - 1].focus()
      }
    }

    // Handle left arrow key
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus()
    }

    // Handle right arrow key
    else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()

    // Get pasted data
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted data contains only numbers
    if (!/^\d+$/.test(pastedData)) {
      return
    }

    // Take only the first 'length' characters
    const digits = pastedData.slice(0, length).split("")

    // Create a new OTP string
    const newOtp = value.split("")
    digits.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit
      }
    })

    const updatedOtp = newOtp.join("")
    onChange(updatedOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((d) => !d)
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex].focus()
    } else if (digits.length < length) {
      inputRefs.current[digits.length].focus()
    } else {
      inputRefs.current[length - 1].focus()
    }
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3 w-full">
      {[...Array(length)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.2 }}
          whileTap={{ scale: 0.97 }}
          className="relative"
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`
              w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold
              rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-1
              transition-all duration-200
              ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 animate-shake"
                  : "border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary/30"
              }
              ${disabled ? "bg-gray-100 dark:bg-gray-800 text-gray-400" : "bg-white dark:bg-gray-950"}
            `}
            aria-label={`Digit ${index + 1}`}
          />
          {index < length - 1 && index % 3 === 2 && (
            <div className="hidden sm:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default OtpInput
