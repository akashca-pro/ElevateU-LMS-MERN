import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

const initialState = {
  userData: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    removeUserCredentials: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      window.location.href = "/user/login";
    },
  },
});

export const { setUserCredentials, removeUserCredentials } = userAuthSlice.actions;
export default userAuthSlice.reducer;
