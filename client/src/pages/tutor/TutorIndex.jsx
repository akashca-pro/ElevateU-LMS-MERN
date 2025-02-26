import React from 'react'
import {Routes , Route, Outlet} from 'react-router-dom'

import {useTutorSignupMutation, useTutorVerifyOtpMutation, useTutorLoginMutation,
   useTutorForgotPasswordMutation, useTutorResetPasswordMutation
} from '@/services/TutorApi/tutorAuthApi.js'

import { useTutorAuthActions } from '@/hooks/useDispatch'

// Re-usable component

import SignUp from '@/components/auth/SignUp'
import Login from '@/components/auth/Login'
import OTPVerification from '@/components/auth/OTPVerification'
import ForgotPassword from '@/components/auth/ForgotPassword'
import ResetPassword from '@/components/auth/ResetPassword'
import GoogleAuth from '@/components/auth/GoogleAuth'

// Tutor Profile

import Index from './tutorProfile/Index.jsx'
import Profile from './tutorProfile/Profile.jsx'


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
  
        <Route path="sign-up" element={<SignUp role={'tutor'} useSignup={useTutorSignupMutation}/>} />
        <Route path="verify-otp" element={<OTPVerification role={'tutor'} useVerifyOtp={useTutorVerifyOtpMutation} useAuthActions={useTutorAuthActions}/>} />
        <Route path="login" element={<Login role={'tutor'} useLogin={useTutorLoginMutation} useAuthActions={useTutorAuthActions} /> } />
        <Route path="forgot-password" element={<ForgotPassword useForgotPassword={useTutorForgotPasswordMutation} navigateTo={'/tutor/reset-password'}/>} />
        <Route path='reset-password'element={<ResetPassword role={'tutor'} useResetPassword={useTutorResetPasswordMutation} navigateTo={'/tutor/login'}/>}/>
        <Route path='auth-success' element={<GoogleAuth/>} />

        <Route path='profile' element={<Index/>}>
          <Route index element={<Profile/>}/>

        </Route>
  
    </Route>
  </Routes>
)

}

export default TutorRoutes
