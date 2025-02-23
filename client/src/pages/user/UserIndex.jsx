import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import UserSignUp from './auth/UserSignup';
import UserOTPVerification from './auth/UserOTPVerification';
import UserLogin from './auth/UserLogin';
import UserForgotPassword from './auth/UserForgotPassword';

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
      </Route>
    </Routes>
  );
};

export default UserRoutes;