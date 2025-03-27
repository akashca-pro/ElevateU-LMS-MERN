import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { removeAdminCredentials } from '@/features/auth/admin/adminAuthSlice.js';
import { removeTutorCredentials } from '@/features/auth/tutor/tutorAuthSlice.js';
import { removeUserCredentials } from '@/features/auth/user/userAuthSlice.js';

// Helper function to get user ID based on role
const getUserId = (state, role) => {
    switch (role) {
        case 'admin':
            return state.adminAuth?.userData?._id;
        case 'tutor':
            return state.tutorAuth?.tutorData?._id;
        case 'user':
            return state.userAuth?.userData?._id;
        default:
            return null;
    }
};

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

// // Enhanced base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // If unauthorized, attempt token refresh
    if (result.error && result.error.status === 401) {
        const state = api.getState();
        const roles = [
            { role: 'admin', authenticated: state.adminAuth?.isAuthenticated },
            { role: 'tutor', authenticated: state.tutorAuth?.isAuthenticated },
            { role: 'user', authenticated: state.userAuth?.isAuthenticated }
        ];

        // Filter authenticated roles
        const authenticatedRoles = roles.filter(r => r.authenticated);

        if (authenticatedRoles.length === 0) {
            await handleLogout(api.dispatch, state);
            return result;
        }

        // Attempt token refresh for each authenticated role
        for (const { role } of authenticatedRoles) {
            const userId = getUserId(state, role);
            if (!userId) continue;

            try {
                const refreshResult = await baseQuery(
                    `${role}/refresh-token/${userId}`, 
                    api, 
                    extraOptions
                );

                // If refresh successful, retry original request
                if (refreshResult.data) {
                    return await baseQuery(args, api, extraOptions);
                }
            } catch (refreshError) {
                console.error(`Token refresh failed for ${role}:`, refreshError);
            }
        }

        // If all refresh attempts fail, logout
        await handleLogout(api.dispatch, state);
    }

    return result;
};

// Create API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery : baseQueryWithReauth,
    tagTypes: ['Admin', 'User', 'Tutor', 'Common'],
    endpoints: () => ({}),
});

export default apiSlice;