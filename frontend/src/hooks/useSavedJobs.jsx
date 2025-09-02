import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedJobs } from '../redux/jobSlice';

const useSavedJobs = () => {
    const dispatch = useDispatch();
    
    // Safely access the Redux store with fallback
    const savedJobs = useSelector(store => store?.job?.savedJobs) || [];

    // Load saved jobs from localStorage on component mount
    useEffect(() => {
        try {
            const savedJobsFromStorage = localStorage.getItem('savedJobs');
            if (savedJobsFromStorage) {
                const parsedJobs = JSON.parse(savedJobsFromStorage);
                if (Array.isArray(parsedJobs)) {
                    dispatch(setSavedJobs(parsedJobs));
                }
            }
        } catch (error) {
            console.error('Error parsing saved jobs from localStorage:', error);
            localStorage.removeItem('savedJobs');
        }
    }, [dispatch]);

    // Save jobs to localStorage whenever savedJobs changes
    useEffect(() => {
        if (savedJobs && Array.isArray(savedJobs)) {
            try {
                localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            } catch (error) {
                console.error('Error saving jobs to localStorage:', error);
            }
        }
    }, [savedJobs]);

    return { savedJobs };
};

export default useSavedJobs;
