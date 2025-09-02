import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge'
import React from 'react'
import { stripHtmlTags } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addToSavedJobs, removeFromSavedJobs } from '../redux/jobSlice'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'

export default function LatestJobCards({ job, isSaved = false }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const savedJobs = useSelector(store => store?.job?.savedJobs) || [];
    
    // Check if this job is currently saved
    const isCurrentlySaved = savedJobs?.some(savedJob => savedJob._id === job._id) || false

    // Handle save/unsave functionality
    const handleSaveToggle = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking save button
        if (isCurrentlySaved) {
            dispatch(removeFromSavedJobs(job._id))
            toast.success("Job removed from saved jobs")
        } else {
            dispatch(addToSavedJobs(job))
            toast.success("Job saved successfully!")
        }
    }
    
    // Get clean description text for the card
    const cleanDescription = stripHtmlTags(job?.description);

    return (
        <div onClick={() => navigate(`/description/${job?._id}`)} className='p-3 sm:p-4 lg:p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className='font-medium text-sm sm:text-base lg:text-lg truncate'>{job?.company?.name}</h1>
                    <p className='text-xs sm:text-sm text-gray-500 truncate'>{job?.location}</p>
                </div>
                {!isSaved && (
                    <Button 
                        variant="outline" 
                        className={`rounded-full cursor-pointer ${isCurrentlySaved ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`} 
                        size="icon"
                        onClick={handleSaveToggle}
                    >
                        <Bookmark className={`h-3 w-3 sm:h-4 sm:w-4 ${isCurrentlySaved ? 'fill-current' : ''}`} />
                    </Button>
                )}
            </div>
            <div>
                <h1 className='font-bold text-sm sm:text-base lg:text-lg my-2 sm:my-3 line-clamp-2'>{job?.title}</h1>
                <p className='text-xs sm:text-sm text-gray-600 line-clamp-3'>{cleanDescription}</p>
            </div>
            <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-3 sm:mt-4'>
                <Badge className='text-blue-700 font-bold text-xs' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-bold text-xs' variant="ghost">{job?.jobType}</Badge>
                <Badge className='text-[#7209b7] font-bold text-xs' variant="ghost">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}
