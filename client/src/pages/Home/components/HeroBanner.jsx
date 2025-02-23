import { Search } from "lucide-react"
import React from 'react'

const HeroBanner = () => {

    return (
      <div className="relative bg-[#F8F9FF] min-h-[600px] flex items-center px-4 md:px-8 lg:px-12">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Find Your Preferred <span className="text-[#7C3AED]">Courses</span> & Improve Your Skills
            </h1>
            <p className="text-gray-600 text-lg">
              Build skills with courses, certificates, and degrees online from world-class universities and companies.
            </p>
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              src="/Hero_image.png"
              alt="Learning platform hero"
              className="w-full"
            />
          </div>
        </div>
      </div>
    )
  }

export default HeroBanner
