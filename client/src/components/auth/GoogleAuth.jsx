import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const GoogleAuth = ({ role, useGoogleCalback, useAuthActions }) => {
  const { login } = useAuthActions();
  const navigate = useNavigate();
  const { isLoading, data, error } = useGoogleCalback();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (error) {
      toast.error('Google authentication failed. Please try again.');
      navigate(`/${role}/login`);
    }

    if (data) {
      toast.success('Google authentication successful!');
      login(data[role]); // Save user in Redux
      navigate('/');
    }
  }, [data, error, isLoading, navigate, login, role]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {isLoading ? (
        <p className="text-lg font-semibold">Authenticating...</p>
      ) : (
        <p className="text-lg font-semibold">Redirecting...</p>
      )}
    </div>
  );
};

export default GoogleAuth;