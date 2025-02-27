import React, { useEffect } from 'react';
import { useSelect } from '@/hooks/useSelect.js';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user, tutor, admin } = useSelect();
    const navigate = useNavigate();
    const location = useLocation();
  
   
    const isAuthenticated =
      (role === 'user' && user?.isAuthenticated) ||
      (role === 'tutor' && tutor?.isAuthenticated) ||
      (role === 'admin' && admin?.isAuthenticated);
  
    useEffect(() => {
      if (!isAuthenticated) {
        let loginPath = '/login';
  
        if (role === 'user') loginPath = '/user/login';
        else if (role === 'tutor') loginPath = '/tutor/login';
        else if (role === 'admin') loginPath = '/admin/login';
  
        navigate(loginPath, { replace: true, state: { from: location } });
      }
    }, [isAuthenticated, navigate, location, role]);
  
    if (!isAuthenticated) {
      return null;
    }
  
    return <>{children}</>;
  };

export default ProtectedRoute;