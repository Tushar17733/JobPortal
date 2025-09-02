import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: [],
    },
    reducers: {
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        clearApplicants: (state) => {   // Clear all applicants data
            state.applicants = [];
        }
    }
})

export const { setApplicants, clearApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
