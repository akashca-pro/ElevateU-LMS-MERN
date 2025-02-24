import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import UserSignUp from './auth/UserSignup';
import UserOTPVerification from './auth/UserOTPVerification';
import UserLogin from './auth/UserLogin';
import UserForgotPassword from './auth/UserForgotPassword';
import ResetPassword from './auth/ResetPassword';

import Index from '@/pages/user/userProfile/Index.jsx'
import ProfileDetails from './userProfile/ProfileDetails';
import ProfileEnrolledCourse from './userProfile/ProfileEnrolledCourse';
import ProfileTeachers from './userProfile/ProfileTeachers';
import ProfileMessages2 from './userProfile/ProfileMessages2';
import UserLoginProtect from '@/protectors/user/UserLoginProtect';
import GoogleAuth from './auth/GoogleAuth';


const UserIndex = () => {
  return (
    <>
      <Outlet /> 
    </>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserIndex />}>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="verify-otp" element={<UserOTPVerification />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="forgot-password" element={<UserForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword/>}/>
        <Route path='auth-success' element={<GoogleAuth/>}/>

        <Route path='profile' element={<UserLoginProtect> <Index/> </UserLoginProtect>}>
          <Route index element={<ProfileDetails/>}/>
          <Route path='enrolled-courses' element={<ProfileEnrolledCourse/>}/>
          <Route path='teachers' element={<ProfileTeachers/>}/>
          <Route path='messages' element={<ProfileMessages2/>}/>

        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;