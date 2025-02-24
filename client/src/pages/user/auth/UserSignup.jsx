import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {useUserSignupMutation} from '../../../services/userApi/userAuthApi'
import useForm from "@/hooks/useForm";
import { toast } from "react-toastify";

const SignUp = () => {
  
  const navigate = useNavigate();
  const [userSignup] = useUserSignupMutation();
  const {
    formData, errors, showPassword, showConfirmPassword, handleChange, 
    toggleConfirmPasswordVisibility, togglePasswordVisibility

  } = useForm()

  const handleGoogleAuth =()=>{
    window.location.href = "http://localhost:9000/api/user/google"
  }


  const handleSubmit = async(e)=>{
     e.preventDefault();


    // If there are any validation errors, prevent submission
     if(Object.values(errors).some((err)=> err)) return

     const toastId = toast.loading("Loading");

    try {

      const response = await userSignup(formData).unwrap();

      toast.update(toastId, {
        render: response.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      navigate('/user/verify-otp',{state : formData.email})

    } catch (error) {
      
      toast.update(toastId, {
        render: error?.data?.message || "Signup failed!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      console.log(error.data.message)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="grid h-full w-full md:grid-cols-2 bg-white shadow-lg">
        {/* Left Side */}
        <div className="hidden md:flex items-center justify-center bg-[#1D1042] p-8 text-white w-full h-full">
          <div className="max-w-md space-y-4 text-center">
            <p className="text-2xl font-light">
              In learning you will <span className="text-purple-400">teach</span>, and in teaching you will {" "}
              <span className="text-purple-400">learn</span>.
            </p>
            <p className="text-sm">- Eleanor Roosevelt</p>
            <img src="/signup.svg" alt="" className="w-[710px] h-[595px]" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-gray-500">Create your account to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium block">
                Username
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-2 focus:ring-2 ${
                    errors.firstName ? "border-red-500" : "border-gray-300 focus:border-purple-500/20"
                  }`}
                  placeholder="Enter your username"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>

              {/* Email Field */}
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

              {/* Password Field with Eye Icon */}
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

              {/* Submit Button */}
              <Button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:ring-2 focus:ring-purple-500/20">
                Sign Up
              </Button>
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
                onClick={handleGoogleAuth}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
                Continue with Google
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/user/login" className="text-purple-600 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
