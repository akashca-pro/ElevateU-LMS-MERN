import { useState, useRef, useEffect } from "react"

function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(58)
  const inputs = useRef([])

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000)
      return () => clearInterval(countdown)
    }
  }, [timer])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.value && element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && inputs.current[index - 1]) {
        inputs.current[index - 1].focus()
      }
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="mx-auto w-20">
          <div className="rounded-full bg-purple-100 p-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Email OTP Verification</h1>
          <p className="text-gray-500">
            Enter the verification code we just sent to your email xxxx@stringconsultants.com
          </p>
        </div>
        <form className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            ))}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              Verify
            </button>
            <div className="mt-4 text-sm text-gray-500">
              Didn't receive code?{" "}
              <button
                type="button"
                className={`font-medium ${timer === 0 ? "text-primary" : "text-gray-400"}`}
                disabled={timer > 0}
                onClick={() => setTimer(58)}
              >
                Resend
              </button>
              {timer > 0 && <span className="ml-1">{`00:${timer.toString().padStart(2, "0")}s`}</span>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTPVerification
