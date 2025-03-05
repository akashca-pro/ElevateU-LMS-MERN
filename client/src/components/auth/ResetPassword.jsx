import { Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer.jsx"
import useForm from "@/hooks/useForm"
import useOtp from "@/hooks/useOtp";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = ({role, useResetPassword, navigateTo, useReSend}) => {
    
    const location = useLocation()
    const [resendOtp] = useReSend()
    const navigate = useNavigate()
    const [resetPassword,{isLoading}] = useResetPassword()
 
    const {formData,errors,handleChange,showPassword,showConfirmPassword,toggleConfirmPasswordVisibility
        ,togglePasswordVisibility
    } = useForm()
    
    const {handleChange : handleOtp ,handleKeyDown,inputs,otp, handleResend : reset, timer} = useOtp(6,300)
    
    const isFormValid = Object.values(errors).some((err) => err) || 
    !formData.password || 
    !formData.confirmPassword || otp.includes('');

    const handleResend = async () => {
      const toastId = toast.loading("Loading...");

        const credentials = {
          role ,
          otpType : 'resetPassword',
          email : location.state
        }

      try {
        reset();
        const response = await resendOtp(credentials).unwrap();
        toast.success(response?.message, { id: toastId, duration: 3000 });
      } catch (error) {
        toast.error(error?.data?.message || error?.error || "Reset password Failed, try again later", {
          id: toastId,
          duration: 3000,
        });
      }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const otpCode = otp.join("");
    
      if (Object.values(errors).some((err) => err)) return;
    
      const toastId = toast.loading("Loading...");

      const credentials = {
        role,
        email : location.state,
        password : formData.password,
        otp : otpCode,
        otpType : 'resetPassword'
      }
    
      try {
        const response = await resetPassword(credentials).unwrap();
        toast.success(response?.message, { id: toastId, duration: 3000 });
        navigate(navigateTo);
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message || error?.error || "Reset password Failed, try again later", {
          id: toastId,
          duration: 3000,
        });
        resetForm();
      }
    };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content - Scrollable 30% */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto min-h-[72vh]">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 p-4">
          {/* Left side - Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center h-full">
            <img
              src="/resetpassword.svg"
              alt="Online learning illustration"
              className="w-full max-w-[400px] md:max-w-[500px]"
            />
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center h-full">
            <div className="max-w-[400px] w-full">
            <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold"> Password Reset code</h1>
          <p className="text-gray-500">
            <br/>
          </p>
        </div>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputs.current[index] = el)}
                value={data}
                onChange={(e) => handleOtp(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Didn't receive code?{" "}
              <button
                type="button"
                className={`font-medium ${timer === 0 && isFormValid ? "text-primary" : "text-gray-400"}`}
                disabled={timer > 0 || (isLoading )}
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
                 {/* Password Field with Eye Icon */}
              <div className="space-y-2 relative">
                <label htmlFor="password" className="text-sm font-medium block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="New password"
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-2 focus:ring-2 ${
                      errors.password ? "border-red-500" : "border-gray-300 focus:border-purple-500/20"
                    }`}
                    required
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2">
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password Field with Eye Icon */}
              <div className="space-y-2 relative">
                <label htmlFor="confirmPassword" className="text-sm font-medium block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Confirm password"
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-2 focus:ring-2 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-purple-500/20"
                    }`}
                    required
                  />
                  <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-2 top-2">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
                <button
                 disabled={isLoading || isFormValid}
                  type="submit"
                  className={`w-full rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                    ${isLoading || isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"}
                  `}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Stays at Bottom */}
      <Footer />
    </div>
  )
}

export default ResetPassword