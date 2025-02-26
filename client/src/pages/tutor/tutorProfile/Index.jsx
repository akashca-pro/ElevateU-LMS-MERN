import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'

const Index = () => {
  return (
    <div>

      <Navbar/>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
         
         {/* Profile NavBar */}
  
          {/* Main Content */}

        <Outlet/>
          
        </div>
      </div>

      <Footer/>
      
    </div>
  )
}

export default Index
