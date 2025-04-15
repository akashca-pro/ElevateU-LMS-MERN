import { createSlice } from "@reduxjs/toolkit";

const storedData = localStorage.getItem('courseId')

const initialState = {
    courseId : storedData ? JSON.parse(storedData) : null
}

const courseSlice = createSlice({
    name : 'course',
    initialState,
    reducers : {
        setCourseId : (state,action)=>{
            state.courseId = action.payload
            localStorage.setItem('courseId',JSON.stringify(action.payload))
        },
        removeCourseId : ()=>{
            state.courseId = null
            localStorage.removeItem('courseId')
        }
    }
})

export const { setCourseId, removeCourseId } = courseSlice.actions

export default courseSlice.reducer