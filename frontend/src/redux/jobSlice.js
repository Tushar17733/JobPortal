import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singlejob: null,
        allAdminJobs: [],
        searchJobByText: "",
        allAppliedJobs: [],
        savedJobs: [],
        searchedQuery: "",
        filters: {
            location: [], // array of selected locations
            salary: [], // array of selected salary ranges
            jobType: "", // one of JOB_TYPES
            experienceLevel: "", // 'fresher' | 'senior'
            salaryRange: "", // '0-5' | '5-10' | '10+'
            postedDate: "any" // '24h' | '7d' | '30d' | 'any'
        }
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
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        },
        addToSavedJobs: (state, action) => {
            // Check if job is already saved to avoid duplicates
            if (!state.savedJobs.find(job => job._id === action.payload._id)) {
                state.savedJobs.push(action.payload);
            }
        },
        removeFromSavedJobs: (state, action) => {
            state.savedJobs = state.savedJobs.filter(job => job._id !== action.payload);
        },
        clearJobs: (state) => {   // optional: reset jobs
            state.allJobs = [];
            state.singlejob = null;
            state.allAdminJobs = [];
            state.allAppliedJobs = [];
            state.savedJobs = [];
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilters: (state, action) => {
            const next = { ...state.filters, ...action.payload };
            if (JSON.stringify(state.filters) !== JSON.stringify(next)) {
              state.filters = next;
            }
          },
          
        clearFilters: (state) => {
            state.filters = { location: [], salary: [], jobType: "", experienceLevel: "", salaryRange: "", postedDate: "any" };
        }
    }
})

export const { 
    setAllJobs, 
    setSingleJob, 
    setallAdminJobs, 
    setSearchJobByText, 
    setAllAppliedJobs, 
    setSavedJobs,
    addToSavedJobs,
    removeFromSavedJobs,
    clearJobs, 
    setSearchedQuery,
    setFilters,
    clearFilters 
} = jobSlice.actions;

export default jobSlice.reducer;

