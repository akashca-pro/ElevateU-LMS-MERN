import React, { useEffect } from 'react';
import { useSelect } from '../../hooks/useSelect.js';
import { useNavigate } from 'react-router-dom';

const UserLoginProtect = ({ children }) => {
  const { user } = useSelect();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/user/login');
    }
  }, [user, navigate]); 

  if (!user?.isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
};

export default UserLoginProtect;