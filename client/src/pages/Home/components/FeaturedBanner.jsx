import React from 'react'
import { Star, ArrowRight } from "lucide-react"

const FeaturedBanner = () =>{
    return (
      <div className="bg-[#1E1B4B] py-20">
        <div className="container mx-auto px-4">
          <div className="text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-300">
              Hand-picked Instructor and expertly crafted courses, designed for the modern students and entrepreneur
            </p>
            <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] transition-colors">
              Browse All Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20-%201%20(2)-miIauQInU3FC7HNiOC5hQrgOvg3Szj.png"
                  alt="Cloud Computing Course"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Introduction to Cloud Computing on AWS for Beginners [2025]
                  </h3>
                  <div className="flex items-center gap-2">
                    <img src="/placeholder.svg?height=32&width=32" alt="Jessica Jones" className="w-8 h-8 rounded-full" />
                    <span className="font-medium">Jessica Jones</span>
                    <span className="text-blue-600 ml-auto">$99</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  

export default FeaturedBanner
