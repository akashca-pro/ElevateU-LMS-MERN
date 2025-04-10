import React from 'react'
import {Toaster} from 'sonner'
import {Routes , Route} from 'react-router-dom'

import UserRoutes from '@/pages/user/UserIndex'
import TutorRoutes from '@/pages/tutor/TutorIndex'
import AdminRoutes from '@/pages/admin/AdminIndex'
import Home from '@/pages/Home/Index'
import NotFound from '@/components/FallbackUI/NotFound';

import Explore from '@/pages/explore/Index'
import ExplorePage from './pages/explore/ExplorePage'
import CourseDetails from './pages/explore/CourseDetails'

// checkout page
import ProtectedRoute from './protectors/ProtectedRoute'
import BlockedUI from './components/FallbackUI/BlockedUI'
import Navbar from './components/Navbar'
import CourseEnrollment from './pages/checkout/CourseEnrollment'
import Footer from './components/Footer'
import Index from './pages/checkout/Index'
import PaymentSuccess from './pages/checkout/PaymentSuccess'
import PaymentFailure from './pages/checkout/PaymentFailure'
import ScrollToTop from './components/ScrollToTop'


const App = () => {
  return (
    <>
      <ScrollToTop/>
      <Toaster richColors position='top-right' duration={2000} />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path='/explore' element={<Explore/>}>
        <Route index element={<ExplorePage/>}/>
        <Route path='courses/:courseId' element={<CourseDetails/>} />
        </Route>

        <Route path='/explore/courses/:courseId/checkout' element={
          <ProtectedRoute role={'user'}>
          <BlockedUI >
            <Navbar/>
          <Index/>
          <Footer/>
          </BlockedUI>
          </ProtectedRoute>
        }>
        <Route index element={<CourseEnrollment/>}/>
        <Route path='payment-success' element={<PaymentSuccess/>} />
        <Route path='payment-failed' element={<PaymentFailure/>} />
        </Route>

        <Route path="/user/*" element={<UserRoutes />} />

        <Route path="/tutor/*" element={<TutorRoutes />} />

        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </>
  );
}

export default App
