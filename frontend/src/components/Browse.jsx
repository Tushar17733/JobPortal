import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import Footer from './shared/Footer'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllJobs from '../hooks/useGetAllJobs'
import useSavedJobs from '../hooks/useSavedJobs'
import { useEffect } from 'react'
import { setSearchedQuery } from '../redux/jobSlice'

export default function Browse() {
    useGetAllJobs();
    useSavedJobs(); // Ensure saved jobs persist
    const { allJobs } = useSelector(store => store.job)
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""))
        }
    })


    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-lg sm:text-xl lg:text-2xl my-6 sm:my-8 lg:my-10 text-center sm:text-left'>
                    Search Results ({allJobs.length})
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                    {
                        allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job} />
                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}
