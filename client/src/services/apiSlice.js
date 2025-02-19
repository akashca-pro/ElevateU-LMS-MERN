//  Base API configuration

import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// use this if refreshtoken is invalid or anything error happens so the user will be logged out to log in page
import { adminLogout } from '../features/auth/admin/adminAuthSlice';
import { tutorLogout } from '../features/auth/tutor/tutorAuthSlice';
import { userLogout } from '../features/auth/user/userAuthSlice';

const baseQuery = fetchBaseQuery({
    baseUrl : "http://localhost:9000/api/",
   credentials : 'include',
});

// Enhanced base query to handle token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions); // Step 1: Make the original request
  
    // If 401 Unauthorized, attempt token refresh
    if (result.error && result.error.status === 403) {
      console.log('Token expired, attempting refresh...');
  
      // Detect user role from Redux state
      const state = api.getState();
      let refreshUrl = '';
  
      if (state.adminAuth?.isAuthenticated) {
        refreshUrl = 'admin/refreshtoken';
      } else if (state.tutorAuth?.isAuthenticated) {
        refreshUrl = 'tutor/refreshtoken';
      } else if (state.userAuth?.isAuthenticated) {
        refreshUrl = 'user/refreshtoken';
      } else {
        console.log('No authenticated user, logging out...');
        api.dispatch(userLogout());
        return result;
      }
  
      console.log(`Calling refresh token endpoint: ${refreshUrl}`);
      
      // Attempt to refresh the token
      const refreshResult = await baseQuery(`/${refreshUrl}`, api, extraOptions);
  
      if (refreshResult.data) {
        console.log('Token refreshed, retrying original request...');
        return await baseQuery(args, api, extraOptions); // Step 3: Retry the original request
      } else {
        console.log('Refresh failed, logging out...');
        if (state.adminAuth?.isAuthenticated) {
          api.dispatch(adminLogout());                 // here redux automatically finds the right slice ,each reducer is under one register this unique keys 
        } else if (state.tutorAuth?.isAuthenticated) {
          api.dispatch(tutorLogout());
        } else {
          api.dispatch(userLogout());
        }
      }
    }
  
    return result; // Return the original response (either success or failure)
  };



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : baseQueryWithReauth, // Use modified base query with re-auth
    tagTypes : ['Admin', 'User', 'Tutor'],
    endpoints: () => ({}), // Will be extended by other API files
})

export default apiSlice;