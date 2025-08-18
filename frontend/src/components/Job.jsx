import React from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Bookmark } from 'lucide-react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'


export default function Job({ job }) {
    const navigate = useNavigate()

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className="p-3 sm:p-4 lg:p-5 rounded-md shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
                <p className='text-xs sm:text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) ==0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full cursor-pointer" size="icon">
                    <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
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
                <p className='text-xs sm:text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-3 sm:mt-4'>
                <Badge className='text-blue-700 font-bold text-xs' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='text-[#F83002] font-bold text-xs' variant="ghost">{job?.jobType}</Badge>
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
                <Button className="bg-[#7209b7] cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none">
                    Save for later
                </Button>
            </div>
        </div>
    )
}
