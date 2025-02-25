import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';


import Index from '@/pages/user/userProfile/Index.jsx'
import ProfileDetails from './userProfile/ProfileDetails';
import ProfileEnrolledCourse from './userProfile/ProfileEnrolledCourse';
import ProfileTeachers from './userProfile/ProfileTeachers';
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
        <Route path="sign-up" element={<SignUp role={'user'} useSignup={useUserSignupMutation} />} />
        <Route path="verify-otp" element={<OTPVerification role={'user'} useVerifyOtp={useUserVerifyOtpMutation} useAuthActions={useUserAuthActions}/>} />
        <Route path="login" element={<Login role={'user'} useLogin={useUserLoginMutation} useAuthActions={useUserAuthActions}/>} />
        <Route path="forgot-password" element={<ForgotPassword useForgotPassword={useUserForgotPasswordMutation} navigateTo = {'/user/reset-password'}/>} />
        <Route path='reset-password' element={<ResetPassword role={'user'} useResetPassword={useUserResetPasswordMutation} navigateTo={'/user/login'} />}/>
        <Route path='auth-success' element={<GoogleAuth role={'user'} useGoogleCalback={useUserGoogleCallbackQuery} useAuthActions={useUserAuthActions}/>}/>

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