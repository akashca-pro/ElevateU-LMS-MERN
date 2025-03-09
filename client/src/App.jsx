import React from 'react'
import {Toaster} from 'sonner'
import {Routes , Route} from 'react-router-dom'

import UserRoutes from '@/pages/user/UserIndex'
import TutorRoutes from '@/pages/tutor/TutorIndex'
import AdminRoutes from '@/pages/admin/AdminIndex'
import Index from '@/pages/Home/Index'
import NotFound from '@/components/FallbackUI/NotFound';

const App = () => {
  return (
    <>
      <Toaster richColors position='top-right' duration={2000} />
      <Routes>

        <Route path="/" element={<Index />} />

        <Route path="/user/*" element={<UserRoutes />} />

        <Route path="/tutor/*" element={<TutorRoutes />} />

        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </>
  );
}

export default App
