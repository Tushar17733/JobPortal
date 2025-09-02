import { COMPANY_API_ENDPOINT,} from '../utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCompanies, clearCompany } from '../redux/companySlice'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // Clear any existing companies data first to prevent showing stale data
                dispatch(clearCompany());
                
                const res = await axios.get(`${COMPANY_API_ENDPOINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
    fetchCompanies();
    }, [dispatch])
}

export default useGetAllCompanies;
