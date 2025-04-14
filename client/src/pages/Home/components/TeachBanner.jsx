import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const TeachBanner = () => {
  const navigate = useNavigate()
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
              <Button className='p-5' 
              onClick={()=>navigate('/tutor/sign-up')}
              >
               Start Teaching Today 
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default TeachBanner
