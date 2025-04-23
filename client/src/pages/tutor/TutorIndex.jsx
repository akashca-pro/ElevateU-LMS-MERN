import React from 'react'
import {
BellRing, SquareUser, BookOpen, MessagesSquare, IndianRupee, ChartNoAxesCombined, Settings
} from "lucide-react";

import {Routes , Route, Outlet, Navigate} from 'react-router-dom'

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

import CourseLayout from '@/pages/tutor/courseManagement/Index.jsx'
import CourseDashboard from './courseManagement/CourseDashboard.jsx'
import CourseDetails from './courseManagement/CourseDetails';

import Revenue from './Wallet/WalletPage.jsx'

import Setting from './settings/Index.jsx'

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
  { id: 3, title: "Revenue", icon: IndianRupee, path: "/tutor/profile/revenue" },
  { id: 4, title: "Settings", icon: Settings, path: "/tutor/profile/settings" },
];

const ProtectedLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  return (
    <ProtectedRoute role={'tutor'}>
      <BlockedUI role={'tutor'} >
        <Navbar 
          setSidebarCollapsed={setSidebarCollapsed} 
          isSidebarCollapsed={sidebarCollapsed}
        />
        <Layout 
          menuItems={menuItems} 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        >
          <Outlet/>
        </Layout>
        <Footer/>
      </BlockedUI>
    </ProtectedRoute>
  );
};

const TutorRoutes = ()=>{

return (
  <Routes>
    <Route path='/' element={<TutorIndex/>}>
    <Route index element={<Navigate to='/tutor/login' />} />
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
            <Route path=':courseId' element={ <CourseDetails/>
              }/>
          </Route>
          <Route path='revenue' element={<Revenue/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
    </Route>
  </Routes>
)

}

export default TutorRoutes
