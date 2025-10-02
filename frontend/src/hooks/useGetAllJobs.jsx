import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllJobs, clearJobs } from '../redux/jobSlice';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '../utils/constant';

const useGetAllJobs = () => {
  const dispatch = useDispatch()
  const { searchedQuery, filters } = useSelector(store => store.job)

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // Clear any existing jobs data first to prevent showing stale data
        dispatch(clearJobs());

        const params = new URLSearchParams();
        if (searchedQuery) params.append('keyword', searchedQuery);
        if (filters && filters.location && filters.location.length) params.append('location', filters.location.join(','));
        if (filters && filters.salary && filters.salary.length) params.append('salary', filters.salary.join(','));

        const res = await axios.get(`${JOB_API_ENDPOINT}/get?${params.toString()}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery, filters?.location, filters?.salary]);
}
export default useGetAllJobs
