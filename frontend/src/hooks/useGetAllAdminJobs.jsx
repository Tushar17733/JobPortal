import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setallAdminJobs, clearJobs } from '../redux/jobSlice';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '../utils/constant';

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
  const fetchAllAdminJobs = async () => {
    try {
      // Clear any existing admin jobs data first to prevent showing stale data
      dispatch(clearJobs());
      
      const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setallAdminJobs(res.data.jobs));
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchAllAdminJobs();
}, [dispatch]);
}
export default useGetAllAdminJobs
