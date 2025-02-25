import { useState, useRef, useEffect } from "react";

const useOtp = (length = 6, initialTime = 600) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [timer, setTimer] = useState(initialTime);
  const inputs = useRef([]);

  //  Handle Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Handle OTP Input Change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Prevent non-numeric input

    setOtp((prevOtp) => prevOtp.map((d, idx) => (idx === index ? element.value : d)));

    // Auto-focus next input if available
    if (element.value && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

    // Handle Backspace Navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

    // Handle OTP Resend
  const handleResend = () => {
    setTimer(initialTime); 
    setOtp(new Array(length).fill("")); 
  };

  return {
    otp,
    setOtp,
    timer,
    setTimer,
    inputs,
    handleChange,
    handleKeyDown,
    handleResend,
  };
};

export default useOtp;
