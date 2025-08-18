import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { APPLICATION_API_ENDPOINT } from '../../utils/constant'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setApplicants } from '../../redux/applicationSlice'

export default function Applicants() {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    
    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_ENDPOINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setApplicants(res.data.job));
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllApplicants();
    }, [])

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-8 sm:mt-12 lg:mt-15 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-lg sm:text-xl lg:text-2xl my-4 sm:my-5 text-center sm:text-left'>
                    Applicants ({applicants?.applications?.length})
                </h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}
