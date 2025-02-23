import React from 'react'
import HeroBanner from './components/HeroBanner'
import TransformBanner from './components/TransformBanner'
import CategoriesBanner from './components/CategoriesBanner'
import FeaturedBanner from './components/FeaturedBanner'
import TeachBanner from './components/TeachBanner'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <HeroBanner/>
        <CategoriesBanner/>
        <FeaturedBanner/>
        <TeachBanner/>
        <TransformBanner/>
        <Footer/>
    </div>
  )
}

export default Index
