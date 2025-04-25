import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { removeAdminCredentials } from '@/features/auth/admin/adminAuthSlice.js';
import { removeTutorCredentials } from '@/features/auth/tutor/tutorAuthSlice.js';
import { removeUserCredentials } from '@/features/auth/user/userAuthSlice.js';


// Base query configuration
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
});

// Logout handler
const handleLogout = async (dispatch, state) => {
    if (state.adminAuth?.isAuthenticated) {
        dispatch(removeAdminCredentials());
        await baseQuery({url : "admin/logout", method : 'DELETE'},
                 { dispatch, getState: () => state }, {});
    }
    if (state.tutorAuth?.isAuthenticated) {
        dispatch(removeTutorCredentials());
        await baseQuery({url : "tutor/logout", method : 'DELETE'},
             { dispatch, getState: () => state }, {});
    }
    if (state.userAuth?.isAuthenticated) {
        dispatch(removeUserCredentials());
        await baseQuery({url : "user/logout", method : 'DELETE'}, 
            { dispatch, getState: () => state }, {});
    }
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const state = api.getState();
        await handleLogout(api.dispatch, state); // Direct logout
    }

    return result;
};

// Create API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Admin', 'User', 'Tutor', 'Common', 'Coupon'],
    keepUnusedDataFor: 10, // Reduce cache time (seconds)
    refetchOnMountOrArgChange: 0, // Refetch if older than 30 seconds
    endpoints: () => ({}),
  });

export default apiSlice;