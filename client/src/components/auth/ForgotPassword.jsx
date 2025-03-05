import useForm from "@/hooks/useForm"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import React from "react"


const ForgotPassword = ({role, useForgotPassword, navigateTo }) => {
  const navigate = useNavigate()
  const [forgotPassword,{isLoading}] = useForgotPassword()
  const {formData, handleChange, errors} = useForm()
  const isFormValid = !Object.values(errors).some((err) => err) && formData.email.trim() !== "";
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) return;

    const toastId = toast.loading('Please wait . . .');

    const credentials = {
      role ,
      otpType : 'resetPassword',
      email : formData.email
    }

    try {
        const response = await forgotPassword(credentials).unwrap();
        toast.success(response?.message || 'Password reset OTP sent to mail',{id : toastId});
        navigate(navigateTo, { state: formData.email });

    } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || 'Password reset OTP sent Failed',{id : toastId})
    }
};

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden md:block">
        <img
          src="/forgotPassword.svg"
          alt="Workspace"
          className="h-screen w-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="text-gray-500">
              Forgot your password? No worries, then let's submit password reset. It will be sent to your email.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-2 focus:ring-2 ${
                    errors.email ? "border-red-500" : "border-gray-300 focus:border-purple-500/20"
                  }`}
                  placeholder="name@example.com"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
            <button
             disabled={isLoading || !isFormValid}
              type="submit"
              className={`w-full rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                ${isLoading || !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"}
              `}
            >
              Reset Password
            </button>
          </form>
          <Link to={`/${role}/login`} className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            Back to login screen
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword