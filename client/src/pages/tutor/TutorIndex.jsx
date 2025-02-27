import React from 'react'
import {
BellRing, SquareUser, BookOpen, MessagesSquare, IndianRupee, ChartNoAxesCombined, Settings
} from "lucide-react";

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
import Navbar from '@/components/Navbar.jsx'
import Layout from '@/components/Drawer/Layout.jsx'
import Footer from '@/components/Footer.jsx'


import TutorLoginProtect from '@/protectors/tutor/TutorLoginProtect.jsx'

// Tutor Profile

import ProfileDetails from './tutorProfile/ProfileDetails.jsx'
import Courses from './courseManagement/Courses.jsx'
import Messages from './Messages/Messages.jsx'
import Revenue from './revenue/Revenue.jsx'
import Analytics from './analytics/Analytics.jsx'
import Notification from './Notification/Notification.jsx'
import Setting from './settings/Settings.jsx'


const TutorIndex = () => {
  return (
   <>
    <Outlet/>
   </>
  )
}

const menuItems = [
  { id: 1, title: "Profile", icon: SquareUser, path: "/tutor/profile" },
  { id: 2, title: "Course Management", icon: BookOpen, path: "/tutor/profile/course-management" },
  { id: 3, title: "Messages", icon: MessagesSquare, path: "/tutor/profile/messages" },
  { id: 4, title: "Revenue", icon: IndianRupee, path: "/tutor/profile/revenue" },
  { id: 5, title: "Notifications", icon: BellRing, path: "/tutor/profile/notification" },
  { id: 6, title: "Analytics", icon: ChartNoAxesCombined, path: "/tutor/profile/analytics" },
  { id: 7, title: "Settings", icon: Settings, path: "/tutor/profile/settings" },
];

const ProtectedLayout = ()=>{
  return (
    <TutorLoginProtect>
      <Navbar/>
      <Layout menuItems = {menuItems}>
      <Outlet/>
      </Layout>
      <Footer/>
    </TutorLoginProtect>
  )
}


const TutorRoutes = ()=>{

return (
  <Routes>
    <Route path='/' element={<TutorIndex/>}>
  
        <Route path="sign-up" element={<SignUp role={'tutor'} useSignup={useTutorSignupMutation}/>} />
        <Route path="verify-otp" element={<OTPVerification role={'tutor'} useVerifyOtp={useTutorVerifyOtpMutation} useAuthActions={useTutorAuthActions}/>} />
        <Route path="login" element={<Login role={'tutor'} useLogin={useTutorLoginMutation} useAuthActions={useTutorAuthActions} /> } />
        <Route path="forgot-password" element={<ForgotPassword role={'tutor'} useForgotPassword={useTutorForgotPasswordMutation} navigateTo={'/tutor/reset-password'}/>} />
        <Route path='reset-password'element={<ResetPassword role={'tutor'} useResetPassword={useTutorResetPasswordMutation} navigateTo={'/tutor/login'}/>}/>
        <Route path='auth-success' element={<GoogleAuth/>} />

        <Route path='profile' element={<ProtectedLayout/>}>
          <Route index element={<ProfileDetails/>}/>
          <Route path='course-management' element={<Courses/>}/>
          <Route path='messages' element={<Messages/>}/>
          <Route path='revenue' element={<Revenue/>}/>
          <Route path='analytics' element={<Analytics/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
  
    </Route>
  </Routes>
)

}

export default TutorRoutes
