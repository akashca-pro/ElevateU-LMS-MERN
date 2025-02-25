import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GoogleAuth = ({role,useGoogleCalback ,useAuthActions}) => {
  const { login } = useAuthActions();
  const navigate = useNavigate();
  const { isLoading, data, error } = useGoogleCalback();

  useEffect(() => {
    if (isLoading) return; // Wait until the API call is complete

    if (error) {
      toast.error(error?.data?.message || "Google authentication failed.");
      navigate(`${role}/login`); // Redirect to login page
    }

    if (data) {
      toast.success("Google login successful!");
      login(data.role); // Save user in Redux
      navigate("/");
    }
  }, [data, error, isLoading, navigate, login]);


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
