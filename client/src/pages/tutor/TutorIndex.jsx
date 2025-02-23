import React from 'react'
import {Routes , Route, Outlet} from 'react-router-dom'

import TutorSignUp from './auth/TutorSignup'
import TutorOTPVerification from './auth/TutorOTPVerification'
import TutorLogin from './auth/TutorLogin'
import TutorForgotPassword from './auth/TutorForgotPassword'

const TutorIndex = () => {
  return (
   <>
    <Outlet/>
   </>
  )
}

const TutorRoutes = ()=>{

return (
  <Routes>
    <Route path='/' element={<TutorIndex/>}>
  
        <Route path="sign-up" element={<TutorSignUp />} />
        <Route path="verify-otp" element={<TutorOTPVerification />} />
        <Route path="login" element={<TutorLogin />} />
        <Route path="forgot-password" element={<TutorForgotPassword />} />
  
    </Route>
  </Routes>
)

}

export default TutorRoutes
