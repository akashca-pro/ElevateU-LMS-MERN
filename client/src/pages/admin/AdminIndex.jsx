import React from 'react'
import { Outlet, Route,Routes } from 'react-router-dom'

import AdminSignup from './auth/AdminSignup'
import AdminLogin from './auth/AdminLogin'

const AdminIndex = () => {
  return (
   <>
   <Outlet/>
   </>
  )
}

const AdminRoutes = ()=>{
  return (
    <Routes>
      <Route path='/' element={<AdminIndex/>}>
        <Route path='sign-up' element={<AdminSignup/>}/>
        <Route path='login' element={<AdminLogin/>}/>
      </Route>
    </Routes>
  )
}

export default AdminRoutes
