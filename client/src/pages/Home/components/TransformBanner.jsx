import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React from 'react'
import { useNavigate } from "react-router-dom"

const TransformBanner = () =>{
  const navigate = useNavigate()
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Transform your life through education</h2>
            <p className="text-gray-600 text-lg">
              Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
            </p>
            <Button className='p-5'
            onClick={()=>navigate('/explore')}>
              Checkout Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[#E0F2FE]">
            <img
              src="/image 11.png"
              alt="Student learning online"
              className="w-full"
            />
          </div>
        </div>
      </div>
    )
  }
  

export default TransformBanner
