import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { APPLICATION_API_ENDPOINT } from "../utils/constant";
import { setAllAppliedJobs, clearJobs } from "../redux/jobSlice";

const useGetAllAppliedJobs = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                // Clear any existing applied jobs data first to prevent showing stale data
                dispatch(clearJobs());
                
                const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAppliedJobs();
    }, [dispatch]);
}
export default useGetAllAppliedJobs