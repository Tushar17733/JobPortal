import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singlejob: null,
        allAdminJobs: [],
        searchJobByText: ""
    },

    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singlejob = action.payload;
        },
        setallAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        }
    }
})

export const { setAllJobs, setSingleJob, setallAdminJobs, setSearchJobByText } = jobSlice.actions;
export default jobSlice.reducer;