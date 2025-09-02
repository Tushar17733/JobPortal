import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,  
    user: null,
  },
  reducers: {
    //updater functions like in usestate
    setLoading: (state, action) => {  
      state.loading = action.payload;
    },
    setUser: (state, action) => {  
      state.user = action.payload;
    },
    logout: (state) => {   // useful for logout functionality
      state.user = null;
      state.loading = false;
    }
  }
});

export const { setLoading, setUser, setError, logout } = authSlice.actions;
export default authSlice.reducer;
