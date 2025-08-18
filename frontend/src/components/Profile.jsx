import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar } from './ui/avatar'
import { AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Contact, Mail, Pen } from 'lucide-react'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfile from './UpdateProfile'
import { useSelector } from 'react-redux'

export default function Profile() {
    const isResume = true
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            
            <div className='max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl my-4 sm:my-5 p-4 sm:p-6 lg:p-8 mx-4 sm:mx-6 lg:mx-8'>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6'>
                    <section className='flex items-center gap-3 sm:gap-4'>
                        <Button className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-0 border-r-[50%]" variant="outline" size="icon">
                            <Avatar className="h-[100%] w-[100%]">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}  />
                            </Avatar>
                        </Button>
                        <div>
                            <h1 className='font-medium text-lg sm:text-xl lg:text-2xl'>{user?.fullName}</h1>
                            <p className="text-sm sm:text-base text-gray-600">{user?.profile.bio}</p>
                        </div>
                    </section>
                    <Button onClick={() => setOpen(true)} className="text-right cursor-pointer w-full sm:w-auto" variant="outline">
                        <Pen className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
                
                <div className="mt-6 sm:mt-8">
                    <div className='my-4 sm:my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
                        </div>
                    </div>
                    
                    <div className='my-6 sm:my-7'>
                        <h1 className="text-base sm:text-lg font-semibold mb-3">Skills</h1>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {
                                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                    <Badge key={index} className="text-xs sm:text-sm">{item}</Badge>
                                )) : <span className="text-sm sm:text-base text-gray-500">NA</span>
                            }
                        </div>
                    </div>
                    
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-sm sm:text-base font-bold">Resume</Label>
                        {
                            isResume ? (
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={user?.profile?.resume}
                                    download={user?.profile?.resumeOriginalName}
                                    className="text-blue-500 hover:underline cursor-pointer text-sm sm:text-base break-all"
                                >
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-sm sm:text-base text-gray-500">NA</span>
                            )
                        }
                    </div>
                </div>
            </div>
            
            <div className='max-w-4xl mx-auto bg-white rounded-2xl mx-4 sm:mx-6 lg:mx-8'>
                <h1 className='font-bold text-base sm:text-lg my-4 sm:my-5 px-4 sm:px-6 lg:px-8'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfile open={open} setOpen={setOpen} />
        </div>
    )
}
