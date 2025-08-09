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
            
            <div className='max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <section className='flex items-center gap-4'>
                        <Button className=" h-24 w-24 border-0 border-r-[50%]" variant="outline" size="icon">
                            <Avatar className="h-[100%] w-[100%]">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}  />
                            </Avatar>
                        </Button>
                        <div>
                            <h1 className='font-medium text-2xl'>{user?.fullName}</h1>
                            <p>{user?.profile.bio}</p>
                        </div>
                    </section>
                    <Button onClick={() => setOpen(true)} className="text-right cursor-pointer" variant="outline"><Pen /></Button>
                </div>
                <div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className='my-7'>
                        <h1>Skills</h1>
                        <div className='flex gap-2 mt-2'>
                            {
                                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                    <Badge key={index} className="text-[14px]">{item}</Badge>
                                )) : <span>NA</span>
                            }
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold">Resume</Label>
                        {
                            isResume ? <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={user?.profile?.resume}
                                download={user?.profile?.resumeOriginalName} // <--- this helps force correct name
                                className="text-blue-500 hover:underline cursor-pointer"
                            >
                                {user?.profile?.resumeOriginalName}
                            </a>

                                : <span>NA</span>
                        }
                    </div>

                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfile open={open} setOpen={setOpen} />
        </div>
    )
}
