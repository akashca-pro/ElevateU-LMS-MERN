import { createSlice } from "@reduxjs/toolkit";

const storedData = localStorage.getItem("user");

const initialState = {
  userData: storedData ? JSON.parse(storedData) : null,
  isAuthenticated: !!storedData,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    removeUserCredentials: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUserCredentials, removeUserCredentials } = userAuthSlice.actions;
export default userAuthSlice.reducer;
