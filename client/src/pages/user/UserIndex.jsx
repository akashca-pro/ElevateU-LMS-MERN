import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import {SquareUser, BookOpen, LibraryBig, MessagesSquare, BellRing, Handshake, Paperclip, ClipboardCheck, 
  Trophy, Settings,
  Wallet2
} from 'lucide-react'
import {useUserForgotPasswordMutation,useUserResetPasswordMutation,useUserGoogleCallbackQuery,
  useUserSignupMutation,useUserLoginMutation
} from '@/services/userApi/userAuthApi.js'
import { useUserAuthActions } from '@/hooks/useDispatch.js';

//Re-usable components

import GoogleAuth from '@/components/auth/GoogleAuth';
import ForgotPassword from '@/components/auth/ForgotPassword';
import ResetPassword from '@/components/auth/ResetPassword';
import OTPVerification from '@/components/auth/OTPVerification';
import SignUp from '@/components/auth/SignUp';
import Login from '@/components/auth/Login';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Layout from '@/components/Drawer/Layout';

import Profile from '@/pages/user/ProfileDetails/Index'

import Setting from './settings/Index';

// My course 
import CourseLayout from '@/pages/user/myCourse/Index.jsx'
import CourseDashboard from './myCourse/CourseDashboard/CourseDashboard';
import CourseLearningPage from './myCourse/CourseLearningPage/Index';

import ProtectAuthPage from '@/protectors/ProtectAuthPage';
import ProtectedRoute from '@/protectors/ProtectedRoute';

import NotFound from '@/components/FallbackUI/NotFound';
import BlockedUI from '@/components/FallbackUI/BlockedUI';
import ProtectLearningPage from '@/protectors/ProtectLearningPage';
import WalletPage from './wallet/WalletPage';

import CertificatePage from './certificates/CertificatePage.jsx';

const UserIndex = () => {
  return (
    <>
      <Outlet /> 
    </>
  );
};

const menuItems = [
  { id: 1, title: "Profile", icon: SquareUser, path: "/user/profile" },
  { id: 2, title: "My Courses", icon: BookOpen, path: "/user/profile/my-courses" },
  { id: 3, title: "Certificates", icon: Trophy, path: "/user/profile/certificates" },
  { id: 4, title: "Wallet", icon: Wallet2, path: "/user/profile/wallet" },
  { id: 5, title: "Settings", icon: Settings, path: "/user/profile/settings" },
];


const ProtectedLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  return (
    <ProtectedRoute role={'user'}>
      <BlockedUI role={'user'} >
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


const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserIndex />}>
      <Route index element={<Navigate to='/user/login' />} />
        <Route path="sign-up" element={
          <ProtectAuthPage>
          <SignUp role={'user'}  />
          </ProtectAuthPage>
          } />
        <Route path="verify-otp" element={
          <ProtectAuthPage>
          <OTPVerification role={'user'} useSignup={useUserSignupMutation} useAuthActions={useUserAuthActions}/>
          </ProtectAuthPage>
          } />
        <Route path="login" element={
          <ProtectAuthPage>
          <Login role={'user'} useLogin={useUserLoginMutation} useAuthActions={useUserAuthActions} />
          </ProtectAuthPage>
          } />
        <Route path="forgot-password" element={
          <ProtectAuthPage>
          <ForgotPassword role={'user'} useForgotPassword={useUserForgotPasswordMutation} navigateTo = {'/user/reset-password'} />
          </ProtectAuthPage>
          } />
        <Route path='reset-password' element={
           <ProtectAuthPage>
          <ResetPassword role={'user'} useResetPassword={useUserResetPasswordMutation} navigateTo={'/user/login'} useReSendotp={useUserForgotPasswordMutation}/>
          </ProtectAuthPage>
          }/>
        <Route path='auth-success' element={
          <ProtectAuthPage>
          <GoogleAuth role={'user'} useGoogleCalback={useUserGoogleCallbackQuery} useAuthActions={useUserAuthActions}/>
          </ProtectAuthPage>
          }/>

        <Route path='profile' element={<ProtectedLayout/>}>
          <Route index element={<Profile />}/>
          <Route path='my-courses' element={<CourseLayout/>}>
            <Route index element={<CourseDashboard/>}/>
            <Route path=':courseId' element={
              <ProtectLearningPage>

              <CourseLearningPage/>
              
              </ProtectLearningPage>
              }/>
          </Route>
          <Route path='certificates' element={<CertificatePage/>}/>
          <Route path='wallet' element={<WalletPage/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </Routes>
  );
};

export default UserRoutes;