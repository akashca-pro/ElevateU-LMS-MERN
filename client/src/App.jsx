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


const App = () => {
  return (
    <>
      <Toaster richColors position='top-right' duration={2000} />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path='/explore' element={<Explore/>}>
        <Route index element={<ExplorePage/>}/>
        {/* <Route path='categories/:categoryName' element={}/> */}
        <Route path='courses/:courseName' element={<CourseDetails/>} />
        </Route>

        <Route path='/courses/:courseName/checkout' element={
          <ProtectedRoute role={'user'}>
          <BlockedUI >
            <Navbar/>
          <CourseEnrollment/>
          <Footer/>
          </BlockedUI>
          </ProtectedRoute>
        }/>

        <Route path="/user/*" element={<UserRoutes />} />

        <Route path="/tutor/*" element={<TutorRoutes />} />

        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </>
  );
}

export default App
