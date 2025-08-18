import { Badge } from './ui/badge'
import React from 'react'

export default function LatestJobCards({job}) {
    return (
        <div className='p-3 sm:p-4 lg:p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow'>
            <div>
                <h1 className='font-medium text-sm sm:text-base lg:text-lg truncate'>{job?.company?.name}</h1>
                <p className='text-xs sm:text-sm text-gray-500 truncate'>{job?.location}</p>
            </div>
            <div>
                <h1 className='font-bold text-sm sm:text-base lg:text-lg my-2 sm:my-3 line-clamp-2'>{job?.title}</h1>
                <p className='text-xs sm:text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-3 sm:mt-4'>
                <Badge className='text-blue-700 font-bold text-xs' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-bold text-xs' variant="ghost">{job?.jobType}</Badge>
                <Badge className='text-[#7209b7] font-bold text-xs' variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}
