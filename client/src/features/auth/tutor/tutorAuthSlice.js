import {createSlice} from '@reduxjs/toolkit'

const storedData = localStorage.getItem("tutor");

const initialState = {
    tutorData : storedData ? JSON.parse(storedData) : null,
    isAuthenticated : !!storedData,
}

const tutorAuthSlice = createSlice({
    name : 'tutorAuth',
    initialState,
    reducers : {
        setTutorCredentials : (state,action)=>{
            state.tutorData = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("tutor",JSON.stringify(action.payload))
        },
        removeTutorCredentials : (state)=>{
            state.tutorData = null;
            state.isAuthenticated = false;
            localStorage.removeItem("tutor");
        }
    }
})

export const {setTutorCredentials,removeTutorCredentials} = tutorAuthSlice.actions

export default tutorAuthSlice.reducer