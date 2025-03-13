import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import useForm from "@/hooks/useForm";
import { toast } from "sonner";
import {useSendOtpMutation, useIsAccountExistQuery} from '@/services/commonApi'
import React, { useEffect } from "react"

const SignUp = ({role}) => {
 
  const navigate = useNavigate();
  const [sendOtp,{isLoading}] = useSendOtpMutation();
  const {
    formData, errors, showPassword, showConfirmPassword, handleChange, 
    toggleConfirmPasswordVisibility, togglePasswordVisibility

  } = useForm()

  const { data, isError, error } = useIsAccountExistQuery(
    role,formData.email,  // ✅ Trigger query when email is provided
    { skip: !formData.email } // ✅ Skip API call if email is empty
  );

 
  useEffect(() => {
  if (data?.status === 409) {
    toast.error("Your account already exists. Try logging in.");
    navigate(`/${role}/login`);
  }
}, [data, navigate, role]);


  const isFormValid = Object.values(errors).some((err) => err) || 
    !formData.password || 
    !formData.confirmPassword || 
    !formData.email ||
    !formData.firstName

  const handleGoogleAuth =()=>{
    window.location.href = role === 'user' 
    ? import.meta.env.VITE_GOOGLE_USER_AUTH_REQ 
    : import.meta.env.VITE_GOOGLE_TUTOR_AUTH_REQ
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) return;

    const toastId = toast.loading("Signing up...");


    const credentials = {
      role,
      firstName : formData.firstName,
      email : formData.email,
      otpType : 'signIn'
    }


    try {
      await sendOtp(credentials).unwrap()
      toast.success(
        role === "admin"
          ? "Signup successful"
          : "An OTP has been sent to your registered email address",
        { id: toastId }
      );
      
       if(role === 'admin') navigate("/admin/login");

        navigate(`/${role}/verify-otp`, { state: formData });
      
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed. Try again.", { id: toastId });
    }
  };

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
          <div className="w-full max-w-sm space-y-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{role === "user" ? "Student" : role === "tutor" ? "Tutor" : "Admin"}  Sign Up</h1>
              {role!=='admin' && <p className="text-center text-sm text-gray-600">
              {`Are you a ${role === 'user' ? 'tutor' : 'student'}? Switch to ${role === 'user' ? 'tutor' : 'student'}`} {" "}
              <Link to={`/${role === 'user' ? 'tutor' : 'user'}/sign-up`} className="text-purple-600 hover:underline">
              Signup here!
              </Link>
            </p>}
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
                    placeholder="Password"
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
                    placeholder="Confirm Password"
                  />
                  <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-2 top-2">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <Button 
              disabled={isLoading || isFormValid}
              type="submit"
              className={`w-full rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                ${isLoading || isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"}
              `}
              >
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
            {role!=='admin' && <div className="grid gap-2">
              <button 
                onClick={handleGoogleAuth}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
                Continue with Google
              </button>
            </div>}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to={`/${role}/login`} className="text-purple-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
