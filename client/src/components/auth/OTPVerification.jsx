import useOTP from "@/hooks/useOtp.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {useSendOtpMutation, useVerifyOtpMutation} from '@/services/commonApi'

const OTPVerification = ({ role, useSignup, useAuthActions }) => {
  const location = useLocation();
  const { login } = useAuthActions();
  const [sendOtp] = useSendOtpMutation()
  const [verifyOtp,{isLoading1}] = useVerifyOtpMutation();
  const [signup,{isLoading2}] = useSignup();
  const formData = location.state;
  const { otp, inputs, timer, handleChange, handleKeyDown, handleResend: reset } = useOTP(6,300);

  const isOtpValid = otp.includes("");

  const navigate = useNavigate();

  const handleResend = async () => {
    const toastId = toast.loading("Loading");

    const credentials = {
      role,
      firstName : formData.firstName,
      email : formData.email,
      otpType : 'signIn'
    }

    try {
      reset();
      const response = await sendOtp(credentials).unwrap();
      toast.success(response?.message);
      toast.dismiss(toastId);
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "Reset password failed, try again later");
      toast.dismiss(toastId);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
  
    const otpCode = otp.join("");
  
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
  
    const toastId = toast.loading("Verifying OTP...");
  
    const credentials = {
      role,
      email: formData.email,
      otp: otpCode,
      otpType: "signIn",
    };
  
    try {
      // Verify OTP
      const response = await verifyOtp(credentials).unwrap();
    
      const responseSignup = await signup(formData).unwrap()
      toast.success(responseSignup?.message || "Signup successful", { id: toastId });
      login(responseSignup?.data?._id)
      navigate(`/${role}/profile`)

    } catch (error) {
      toast.error(error?.data?.message || "OTP verification failed!", { id: toastId });
    }
  };

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
            Enter the verification code we just sent to your email {formData.email || "name@example.com"}
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-6">
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
              disabled={isOtpValid || isLoading1}
              className={`w-full rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                ${isLoading1 || isOtpValid ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"}
              `}
            >
              Verify
            </button>
            <div className="mt-4 text-sm text-gray-500">
              Didn't receive code?{" "}
              <button
                type="button"
                className={`font-medium ${timer === 0 ? "text-primary" : "text-gray-400"}`}
                disabled={timer > 0 || isLoading1 || isLoading2 }
                onClick={handleResend}
              >
                Resend
              </button>
              {timer > 0 && (
                <span className="ml-1">
                  {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
