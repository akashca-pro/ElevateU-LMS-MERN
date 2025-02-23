import useForm from "@/hooks/useForm"
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import {useUserLoginMutation} from '../../../services/userApi/userAuthApi.js'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {setUserCredentials} from '../../../features/auth/user/userAuthSlice.js'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userLogin] = useUserLoginMutation()
  const {formData,handleChange,errors,togglePasswordVisibility,showPassword} = useForm()


  const handleSubmit = async(e) => {
    e.preventDefault()
   
    if(Object.values(errors).some((err)=> err)) return

    const toastId = toast.loading("Loading");

    try {

      const response = await userLogin(formData).unwrap();

      toast.update(toastId, { render: response.message, type: "success", isLoading: false, autoClose: 3000 });
    
      dispatch(setUserCredentials(response.user))

      navigate('/')
      
    } catch (error) {
      console.log(error)
      toast.update(toastId, { render: error?.data?.message || error?.error || "Login Failed. Please try again.",type : 'error', isLoading: false, autoClose: 3000 });
    }

  }


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="grid h-full w-full md:grid-cols-2 bg-white shadow-lg">
        <div className="flex items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Log In</h1>
              <p className="text-gray-500">Enter your details to access your account</p>
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
              <div className="space-y-2 relative">
                <label htmlFor="password" className="text-sm font-medium block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
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
              <a href="/user/forgot-password" className="block text-right text-sm text-primary hover:underline">
                Forgot password?
              </a>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                Log in
              </button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>
            <div className="grid gap-2">
              <button 
                onClick={() => {/* Handle Google login */}}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
                Continue with Google
              </button>
              <button 
                onClick={() => {/* Handle Facebook login */}}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.facebook.com/favicon.ico"  alt="Facebook" className="h-5 w-5" />
                Continue with Facebook
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/user/sign-up" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center bg-[#1D1042] p-8 text-white w-full h-full">
          <div className="max-w-md space-y-4 text-center">
            <p className="text-2xl font-light">
              In learning you will <span className="text-purple-400">teach</span>, and in teaching you will {" "}
              <span className="text-purple-400">learn</span>.
            </p>
            <p className="text-sm">- Eleanor Roosevelt</p>
            <img src="/Login.svg" alt="" className="w-[710px] h-[595px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
