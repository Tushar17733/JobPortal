import React from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Bookmark, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { stripHtmlTags } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addToSavedJobs, removeFromSavedJobs } from '../redux/jobSlice'
import { toast } from 'sonner'

export default function Job({ job, isSaved = false }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const savedJobs = useSelector(store => store?.job?.savedJobs) || []

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    // Check if this job is currently saved
    const isCurrentlySaved = savedJobs?.some(savedJob => savedJob._id === job._id) || false

    // Handle save/unsave functionality
    const handleSaveToggle = () => {
        if (isCurrentlySaved) {
            dispatch(removeFromSavedJobs(job._id))
            toast.success("Job removed from saved jobs")
        } else {
            dispatch(addToSavedJobs(job))
            toast.success("Job saved successfully!")
        }
    }

    // Handle delete from saved jobs
    const handleDelete = () => {
        dispatch(removeFromSavedJobs(job._id))
        toast.success("Job removed from saved jobs")
    }

    // Get clean description text for the card
    const cleanDescription = stripHtmlTags(job?.description);

    return (
        <div className="p-3 sm:p-4 lg:p-5 rounded-md shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-shadow relative">
            {/* Delete button for saved jobs */}
            {isSaved && (
                <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full z-10 cursor-pointer"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
            
            <div className="flex items-center justify-between">
                <p className='text-xs sm:text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) ==0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
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

            <div className="flex items-center gap-2 my-2 sm:my-3">
                <Button className="p-4 sm:p-6" variant="outline" size="icon">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={job?.company?.logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmJIzY_eKe0ix6E0LFXpj0TbO96ZtJdf3fqA&s"} />
                    </Avatar>
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className='font-medium text-sm sm:text-base lg:text-lg truncate'>{job?.company?.name}</h1>
                    <p className='text-xs sm:text-sm text-gray-500 truncate'>{job?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-sm sm:text-base lg:text-lg my-2 sm:my-3 line-clamp-2'>{job?.title}</h1>
                <p className='text-xs sm:text-sm text-gray-600 line-clamp-3'>{cleanDescription}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-3 sm:mt-4'>
                <Badge className='text-blue-700 font-bold text-xs' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='text-[#7209b7] font-bold text-xs' variant="ghost">{job?.jobType}</Badge>
                <Badge className='text-[#7209b7] font-bold text-xs' variant="ghost">{job?.salary} LPA</Badge>
            </div>
            
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
                >
                    Details
                </Button>
                {!isSaved && (
                    <Button 
                        className="bg-[#7209b7] cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
                        onClick={handleSaveToggle}
                    >
                        {isCurrentlySaved ? 'Saved' : 'Save for later'}
                    </Button>
                )}
            </div>
        </div>
    )
}
