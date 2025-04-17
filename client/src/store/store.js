import {configureStore} from '@reduxjs/toolkit'
import apiSlice from '../services/apiSlice.js'

import adminAuthReducer from '../features/auth/admin/adminAuthSlice.js'
import tutorAuthReducer from '../features/auth/tutor/tutorAuthSlice.js'
import userAuthReducer from '../features/auth/user/userAuthSlice.js'

import { toast } from 'sonner'

// middleware to handle 403 error
const apiMiddleware = (store) => (next) => (action) => {
    if (action.type.endsWith('/rejected')) {
      const status = action.payload?.status || action.error?.status;
      if (status === 403) {
        toast.dismiss()
        window.dispatchEvent(new CustomEvent('userBlocked', {
          detail: { message: 'User blocked' }
        }));
      }
    }
    return next(action);
  };

const store = configureStore({
    reducer : {
        adminAuth : adminAuthReducer,
        tutorAuth : tutorAuthReducer,
        userAuth : userAuthReducer,
        [apiSlice.reducerPath] : apiSlice.reducer
    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware, apiMiddleware)
});

export default store