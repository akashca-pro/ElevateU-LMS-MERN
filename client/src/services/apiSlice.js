//  Base API configuration
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// use this if refreshtoken is invalid or anything error happens so the user will be logged out to log in page
import { removeAdminCredentials } from '@/features/auth/admin/adminAuthSlice.js';
import { removeTutorCredentials } from '@/features/auth/tutor/tutorAuthSlice.js';
import { removeUserCredentials } from '@/features/auth/user/userAuthSlice.js';

const baseQuery = fetchBaseQuery({
    baseUrl : import.meta.env.VITE_BASE_URL,
   credentials : 'include',
});

// // Enhanced base query to handle token refresh
// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//       console.log(' Token expired, attempting refresh...');

//       const state = api.getState();
//       let refreshResults = {};

//       // Collect all active roles
//       const roles = [];
//       if (state.adminAuth?.isAuthenticated) roles.push({ role: "admin", url: "admin/refresh-token" });
//       if (state.tutorAuth?.isAuthenticated) roles.push({ role: "tutor", url: "tutor/refresh-token" });
//       if (state.userAuth?.isAuthenticated) roles.push({ role: "user", url: "user/refresh-token" });

//       if (roles.length === 0) {
//           console.log(' No authenticated user, logging out...');
//           api.dispatch(removeUserCredentials());
//           return result;
//       }

//       // Refresh tokens for all active roles
//       for (const { role, url } of roles) {
//           console.log(` Refreshing token for ${role}: ${url}`);
//           refreshResults[role] = await baseQuery(`/${url}`, api, extraOptions);
//       }

//       // Check if any refresh request succeeded
//       const successfulRefresh = Object.entries(refreshResults).some(([role, res]) => res.data);

//       if (successfulRefresh) {
//           console.log(' At least one token refreshed, retrying original request...');
//           return await baseQuery(args, api, extraOptions); // Retry the original request
//       } else {
//           console.log(' Refresh failed for all roles, logging out...');
//           if (state.adminAuth?.isAuthenticated) api.dispatch(removeAdminCredentials());
//           if (state.tutorAuth?.isAuthenticated) api.dispatch(removeTutorCredentials());
//           if (state.userAuth?.isAuthenticated) api.dispatch(removeUserCredentials());
//       }
//   }

//   return result;
// };


export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery ,
    tagTypes : ['Admin', 'User', 'Tutor','Common'],
    endpoints: () => ({}), // Will be extended by other API files
})

export default apiSlice;