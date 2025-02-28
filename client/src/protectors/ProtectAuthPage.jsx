import React, { useEffect } from 'react';
import { useSelect } from '@/hooks/useSelect.js';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectAuthPage = ({children}) =>{
    const { user, tutor, admin } = useSelect();
    const navigate = useNavigate();
    const location = useLocation();
  
    const isAuthenticated = user?.isAuthenticated || tutor?.isAuthenticated || admin?.isAuthenticated;
  
    useEffect(() => {
      if (isAuthenticated) {
        navigate('/',{replace : true});
       
      }
    }, [isAuthenticated, navigate, location]);
  
    if (isAuthenticated) {
      return null;
    }
  
    return <>{children}</>;
  };
  
  

export default ProtectAuthPage
