import useForm from "@/hooks/useForm"
import { Link, useNavigate } from "react-router-dom"
import {useUserForgotPasswordMutation} from '@/services/userApi/userAuthApi.js'
import { toast } from "react-toastify"


const ForgotPassword = () => {
  const navigate = useNavigate()
  const [userForgotPassword,{isLoading}] = useUserForgotPasswordMutation()
  const {formData,handleChange,errors} = useForm()

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    if(Object.values(errors).some((err)=> err)) return

    const toastId = toast.loading('Loading')

    try {
      const response = await userForgotPassword({email : formData.email}).unwrap()

      toast.update(toastId, { render: response?.message, type: "success", isLoading: false, autoClose: 3000 });

      navigate('/user/reset-password')

    } catch (error) {
      console.log(error)
      toast.update(toastId, { render: error?.data?.message || error?.error || "Reset password Failed try again later",type : 'error', isLoading: false, autoClose: 3000 });
    }

  }

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
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              Reset Password
            </button>
          </form>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            Back to login screen
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword