import {createSlice} from '@reduxjs/toolkit'

const storedData = localStorage.getItem("admin");

const initialState = {
    adminData : storedData ? JSON.parse(storedData) : null,
    isAuthenticated : !!storedData
}

const adminAuthSlice = createSlice({
    name : 'adminAuth',
    initialState,
    reducers : {
        setAdminCredentials : (state,action)=>{
            state.adminData = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("admin",JSON.stringify(action.payload))
        },
        removeAdminCredentials : (state)=>{
            state.adminData = null;
            state.isAuthenticated = false;
            localStorage.removeItem("admin")
            window.location.href = '/admin/login'
        }
    }
})

export const {setAdminCredentials,removeAdminCredentials} = adminAuthSlice.actions

export default adminAuthSlice.reducer