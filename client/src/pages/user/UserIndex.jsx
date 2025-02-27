import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import {SquareUser, BookOpen, LibraryBig, MessagesSquare, BellRing, Handshake, Paperclip, ClipboardCheck, 
  Trophy, Settings
} from 'lucide-react'

import ProfileDetails from './userProfile/ProfileDetails/ProfileDetails';
import CourseDetails from './my-course/CourseDetails';
import ProfileMessages2 from './userProfile/ProfileMessages2';
import UserLoginProtect from '@/protectors/user/UserLoginProtect';


import {useUserForgotPasswordMutation,useUserResetPasswordMutation,useUserGoogleCallbackQuery,
  useUserVerifyOtpMutation,useUserSignupMutation,useUserLoginMutation
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


import EnrolledCourses from './enrolledCourses/Index';
import Notification from './notification/Index';
import Assignments from './assignments/Index';
import Messages from './messages/Index';
import Community from './community/Index';
import Certificates from './certificates/Index';
import Quiz from './quiz/Index';
import Setting from './settings/Index';

import ProtectAuthPage from '@/protectors/ProtectAuthPage';

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
  { id: 3, title: "Enrolled courses", icon: LibraryBig, path: "/user/profile/enrolled-courses" },
  { id: 4, title: "Messages", icon: MessagesSquare, path: "/user/profile/messages" },
  { id: 5, title: "Notifications", icon: BellRing, path: "/user/profile/notification" },
  { id: 6, title: "Community", icon: Handshake, path: "/user/profile/community" },
  { id: 7, title: "Assignments", icon: Paperclip, path: "/user/profile/assignments" },
  { id: 8, title: "Quiz", icon: ClipboardCheck, path: "/user/profile/quiz" },
  { id: 9, title: "Certificates", icon: Trophy, path: "/user/profile/certificates" },
  { id: 10, title: "Settings", icon: Settings, path: "/user/profile/settings" },
];


const ProtectedLayout = () => (
  <UserLoginProtect>
    <Navbar/>
    <Layout menuItems = {menuItems}  >
      <Outlet/>
    </Layout>
    <Footer/>
  </UserLoginProtect>
);


const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserIndex />}>
        <Route path="sign-up" element={
          <ProtectAuthPage>
          <SignUp role={'user'} useSignup={useUserSignupMutation} />
          </ProtectAuthPage>
          } />
        <Route path="verify-otp" element={
          <ProtectAuthPage>
          <OTPVerification role={'user'} useVerifyOtp={useUserVerifyOtpMutation} useAuthActions={useUserAuthActions}/>
          </ProtectAuthPage>
          } />
        <Route path="login" element={<Login role={'user'} useLogin={useUserLoginMutation} useAuthActions={useUserAuthActions} />} />
        <Route path="forgot-password" element={<ForgotPassword role={'user'} useForgotPassword={useUserForgotPasswordMutation} navigateTo = {'/user/reset-password'}/>} />
        <Route path='reset-password' element={<ResetPassword role={'user'} useResetPassword={useUserResetPasswordMutation} navigateTo={'/user/login'} />}/>
        <Route path='auth-success' element={<GoogleAuth role={'user'} useGoogleCalback={useUserGoogleCallbackQuery} useAuthActions={useUserAuthActions}/>}/>

        <Route path='profile' element={<ProtectedLayout/>}>
          <Route index element={<ProfileDetails />}/>
          <Route path='my-courses' element={<CourseDetails/>}/>
          <Route path='enrolled-courses' element={<EnrolledCourses/>}/>
          <Route path='messages' element={<Messages/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='community' element={<Community/>}/>
          <Route path='assignments' element={<Assignments/>}/>
          <Route path='quiz' element={<Quiz/>}/>
          <Route path='certificates' element={<Certificates/>}/>
          <Route path='settings' element={<Setting/>}/>

        </Route>
  
      </Route>
    </Routes>
  );
};

export default UserRoutes;