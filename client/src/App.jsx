import React from 'react'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import {Routes , Route} from 'react-router-dom'

import UserRoutes from './pages/user/UserIndex'
import TutorRoutes from './pages/tutor/TutorIndex'
import AdminRoutes from './pages/admin/AdminIndex'
import Index from './pages/Home/Index'
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

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
