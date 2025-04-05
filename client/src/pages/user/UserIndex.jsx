import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import {SquareUser, BookOpen, LibraryBig, MessagesSquare, BellRing, Handshake, Paperclip, ClipboardCheck, 
  Trophy, Settings
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

import Notification from './notification/Index';
import Assignments from './assignments/Index';
import Messages from './messages/Index';
import Community from './community/Index';
import Certificates from './certificates/Index';
import Quiz from './quiz/Index';
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
  { id: 4, title: "Messages", icon: MessagesSquare, path: "/user/profile/messages" },
  { id: 5, title: "Community", icon: Handshake, path: "/user/profile/community" },
  { id: 6, title: "Assignments", icon: Paperclip, path: "/user/profile/assignments" },
  { id: 7, title: "Quiz", icon: ClipboardCheck, path: "/user/profile/quiz" },
  { id: 8, title: "Certificates", icon: Trophy, path: "/user/profile/certificates" },
  { id: 9, title: "Settings", icon: Settings, path: "/user/profile/settings" },
];


const ProtectedLayout = () => (
  <ProtectedRoute role={'user'}>
    <BlockedUI >
    <Navbar/>
    <Layout menuItems = {menuItems}  >
      <Outlet/>
    </Layout>
    <Footer/>
    </BlockedUI>
    </ProtectedRoute>
);


const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserIndex />}>
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
          <Route path='messages' element={<Messages/>}/>
          <Route path='community' element={<Community/>}/>
          <Route path='assignments' element={<Assignments/>}/>
          <Route path='quiz' element={<Quiz/>}/>
          <Route path='certificates' element={<Certificates/>}/>
          <Route path='settings' element={<Setting/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </Routes>
  );
};

export default UserRoutes;