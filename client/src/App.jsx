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
import CategoryBasedCourses from './pages/explore/CategoryBasedCourses'

const App = () => {
  return (
    <>
      <Toaster richColors position='top-right' duration={2000} />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path='/explore' element={<Explore/>}>
        <Route index element={<ExplorePage/>}/>
        <Route path='categories/:categoryName' element={<CategoryBasedCourses/>}/>
        <Route path='courses/:courseName' element={<CourseDetails/>} />
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
