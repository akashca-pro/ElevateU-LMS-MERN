import React from 'react'

const TeachBanner = () => {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/image 26.png"
              alt="Teacher profile"
              className="w-full"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Courses taught by industry leaders around the world</h2>
            <p className="text-gray-600">
              Join a global community of educators and share your expertise with eager learners.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors">
                Start Teaching Today
              </button>
              <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Teachers
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default TeachBanner
