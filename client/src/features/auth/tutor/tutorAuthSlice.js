import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    tutor : null,
    isAuthenticated : false
}

const tutorAuthSlice = createSlice({
    name : 'tutorAuth',
    initialState,
    reducers : {
        tutorLogin : (state,action)=>{
            state.tutor = action.payload.tutor;
            state.isAuthenticated = true;
        },
        tutorLogout : (state)=>{
            state.tutor = null;
            state.isAuthenticated = false;
        }
    }
})

export const {tutorLogin,tutorLogout} = tutorAuthSlice.actions

export default tutorAuthSlice.reducer