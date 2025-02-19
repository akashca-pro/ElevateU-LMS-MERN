import {configureStore} from '@reduxjs/toolkit'
import apiSlice from '../services/apiSlice.js'

import adminAuthReducer from '../features/auth/admin/adminAuthSlice.js'
import tutorAuthReducer from '../features/auth/tutor/tutorAuthSlice.js'
import userAuthReducer from '../features/auth/user/userAuthSlice.js'

const store = configureStore({
    reducer : {
        adminAuth : adminAuthReducer,
        tutorAuth : tutorAuthReducer,
        userAuth : userAuthReducer,
        [apiSlice.reducerPath] : apiSlice.reducer
    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store