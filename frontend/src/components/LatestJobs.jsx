import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import useSavedJobs from '../hooks/useSavedJobs';

export default function LatestJobs() {
    useSavedJobs(); // Ensure saved jobs persist
    const {allJobs} = useSelector(store=>store.job);

    return (
        <div className='max-w-7xl mx-auto my-10 sm:my-16 lg:my-20 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left'>
                <span className='text-[rgb(106,56,194)]'>Latest & Top </span> Job Openings
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-5 sm:my-8'>
                {
                    allJobs.length <=0 ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                            <span className="text-gray-500">Jobs not available</span>
                        </div>
                    ) : (
                        allJobs.slice(0, 9).map((job) => <LatestJobCards key={job._id} job={job}/>)
                    )
                }
            </div>
        </div>
    )
}
