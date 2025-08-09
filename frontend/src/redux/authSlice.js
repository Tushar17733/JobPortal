import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,  //initial state
    user:null
  },
  reducers: {
    // actions
    setLoading: (state, action) => {  //updater function like in usestate
      state.loading = action.payload;
    },
    setUser: (state, action) => {  
      state.user = action.payload;
    }
  }
});

export const { setLoading,setUser } = authSlice.actions;
export default authSlice.reducer;
