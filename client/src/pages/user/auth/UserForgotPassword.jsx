"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle password reset logic here
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden md:block">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/forgot_password-zdrKz0lcq6fR1CWw8DxcLsR34rU4d0.png"
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
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="elementary221b@gmail.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              Reset Password
            </button>
          </form>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to login screen
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword