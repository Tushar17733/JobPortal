import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs, clearJobs } from '../redux/jobSlice';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '../utils/constant';

const useGetAllJobs = () => {
  const dispatch = useDispatch()
  const {searchedQuery} = useSelector(store=>store.job)
  
  useEffect(() => {
  const fetchAllJobs = async () => {
    try {
      // Clear any existing jobs data first to prevent showing stale data
      dispatch(clearJobs());
      
      const res = await axios.get(`${JOB_API_ENDPOINT}/get?keyword=${searchedQuery}`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchAllJobs();
}, [dispatch, searchedQuery]);
}
export default useGetAllJobs
