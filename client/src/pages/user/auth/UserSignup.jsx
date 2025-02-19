import { Button } from "@/components/ui/button"
import { useState } from "react"

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="grid h-full w-full md:grid-cols-2 bg-white shadow-lg">
        <div className="hidden md:flex items-center justify-center bg-[#1D1042] p-8 text-white w-full h-full">
          <div className="max-w-md space-y-4 text-center">
            <p className="text-2xl font-light">
              In learning you will <span className="text-purple-400">teach</span>, and in teaching you will {" "}
              <span className="text-purple-400">learn</span>.
            </p>
            <p className="text-sm">- Eleanor Roosevelt</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-gray-500">Create your account to get started</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium block">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>
              <Button type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20">
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
                onClick={() => {/* Handle Google signup */}}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
                Continue with Google
              </button>
              <button 
                onClick={() => {/* Handle Facebook signup */}}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="h-5 w-5" />
                Continue with Facebook
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;