import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user : null,
    isAuthenticated : false
}

const userAuthSlice = createSlice({
    name : 'userAuth',
    initialState,
    reducers : {
        userLogin : (state,action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLogout : (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            window.location.href = '/user/login'
        }
    }
})

export const {userLogin,userLogout} = userAuthSlice.actions

export default userAuthSlice.reducer