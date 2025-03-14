import React from 'react'
import {
BellRing, SquareUser, BookOpen, MessagesSquare, IndianRupee, ChartNoAxesCombined, Settings
} from "lucide-react";

import {Routes , Route, Outlet} from 'react-router-dom'

import {useTutorSignupMutation, useTutorLoginMutation,useTutorIsVerifiedQuery,
   useTutorForgotPasswordMutation, useTutorResetPasswordMutation ,useTutorGoogleCallbackQuery
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
import NotFound from '@/components/FallbackUI/NotFound'
import BlockedUI from '@/components/FallbackUI/BlockedUI';
import IsAccessGranted from './courseManagement/IsAccessGranted';


// Tutor Profile

import ProtectAuthPage from '@/protectors/ProtectAuthPage.jsx';
import ProtectedRoute from '@/protectors/ProtectedRoute.jsx';

import ProfileDetails from './tutorProfile/Index'

import Messages from './Messages/Messages.jsx'
import Revenue from './revenue/Revenue.jsx'
import Analytics from './analytics/Analytics.jsx'
import Notification from './Notification/Index.jsx'
import Setting from './settings/Settings.jsx'


import CourseLayout from '@/pages/tutor/courseManagement/Index.jsx'
import CourseDashboard from './courseManagement/CourseDashboard.jsx'
import CourseDetails from './courseManagement/CourseDetails';



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
    <ProtectedRoute role={'tutor'}>
      <BlockedUI role={'tutor'}>
      <Navbar/>
      <Layout menuItems = {menuItems}>
      <Outlet/>
      </Layout>
      <Footer/>
      </BlockedUI>
    </ProtectedRoute>
  )
}


const TutorRoutes = ()=>{

return (
  <Routes>
    <Route path='/' element={<TutorIndex/>}>
  
        <Route path="sign-up" element={
          <ProtectAuthPage>
          <SignUp role={'tutor'} />
          </ProtectAuthPage>
          } />
        <Route path="verify-otp" element={
          <ProtectAuthPage>
          <OTPVerification role={'tutor'} useSignup={useTutorSignupMutation} useAuthActions={useTutorAuthActions}/>
          </ProtectAuthPage>
          } />
        <Route path="login" element={
          <ProtectAuthPage>
          <Login role={'tutor'} useLogin={useTutorLoginMutation} useAuthActions={useTutorAuthActions} /> 
          </ProtectAuthPage>
          } />
        <Route path="forgot-password" element={
          <ProtectAuthPage>
          <ForgotPassword role={'tutor'} useForgotPassword={useTutorForgotPasswordMutation} navigateTo={'/tutor/reset-password'}/>
          </ProtectAuthPage>
          } />
        <Route path='reset-password'element={
          <ProtectAuthPage>
          <ResetPassword role={'tutor'} useResetPassword={useTutorResetPasswordMutation} navigateTo={'/tutor/login'} useReSend={useTutorForgotPasswordMutation}/>
          </ProtectAuthPage>
          }/>
        <Route path='auth-success' element={
          <ProtectAuthPage>
          <GoogleAuth role={'tutor'} useGoogleCalback={useTutorGoogleCallbackQuery} useAuthActions={useTutorAuthActions}/>
          </ProtectAuthPage>
          } />

        <Route path='profile' element={<ProtectedLayout/>}>
          <Route index element={<ProfileDetails/>}/>
          <Route path='course-management' element={
            <IsAccessGranted useCheckApi = {useTutorIsVerifiedQuery} >
            <CourseLayout/>
            </IsAccessGranted>
            }>
            <Route index element={
                <CourseDashboard/>}
              />
            <Route path=':courseId' element={<CourseDetails/>}/>
          </Route>
          <Route path='messages' element={<Messages/>}/>
          <Route path='revenue' element={<Revenue/>}/>
          <Route path='analytics' element={<Analytics/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
    </Route>
  </Routes>
)

}

export default TutorRoutes
