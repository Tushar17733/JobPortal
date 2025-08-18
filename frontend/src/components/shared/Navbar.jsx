import React, { useState } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_ENDPOINT } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { setUser } from '../../redux/authSlice';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_ENDPOINT}/logout`, { withCredentials: true });

            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                <Link to={user?.role === "recruiter" ? "/admin" : "/"}>
                    <div className='cursor-pointer'>
                        <h1 className='text-xl sm:text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                    </div>
                </Link>
                
                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8 lg:gap-12'>
                    <ul className='flex font-medium items-center gap-4 lg:gap-5 cursor-pointer'>
                        {
                            user && user.role === "recruiter" ? (
                                <>
                                    <Link to="/admin/companies" className="hover:text-[#6A38C2] transition-colors">Companies</Link>
                                    <Link to="/admin/jobs" className="hover:text-[#6A38C2] transition-colors"> Jobs</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="hover:text-[#6A38C2] transition-colors">Home</Link>
                                    <Link to="/jobs" className="hover:text-[#6A38C2] transition-colors"> Jobs</Link>
                                    <Link to="/browse" className="hover:text-[#6A38C2] transition-colors"> Browse</Link>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className="cursor-pointer text-sm sm:text-base">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6a38c2] hover:bg-[#431692] cursor-pointer text-sm sm:text-base">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"} alt="" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="flex gap-4 space-y-2">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"} alt="@shadcn" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullName}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2 text-gray-600'>
                                        {
                                            user && user.role === "candidate" && (
                                                <div className="flex flex-wrap items-center gap-2 md:flex-row ml-[-13px] mt-[10px]">
                                                    <Button variant="link" className="cursor-pointer"><Link to="/profile">View Profile</Link></Button>
                                                </div>
                                            )
                                        }

                                        <div className="flex flex-wrap items-center gap-2 md:flex-row ">
                                            <Button onClick={logoutHandler} className="cursor-pointer">Logout</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>

                {/* Mobile menu button */}
                <div className='md:hidden flex items-center gap-2'>
                    {!user && (
                        <div className='flex items-center gap-2'>
                            <Link to="/login">
                                <Button variant="outline" className="cursor-pointer text-sm">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6a38c2] hover:bg-[#431692] cursor-pointer text-sm">Signup</Button>
                            </Link>
                        </div>
                    )}
                    {user && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"} alt="" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="flex gap-4 space-y-2">
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"} alt="@shadcn" />
                                    </Avatar>
                                    <div>
                                        <h4 className='font-medium'>{user?.fullName}</h4>
                                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2 text-gray-600'>
                                    {
                                        user && user.role === "candidate" && (
                                            <div className="flex flex-wrap items-center gap-2 md:flex-row ml-[-13px] mt-[10px]">
                                                <Button variant="link" className="cursor-pointer"><Link to="/profile">View Profile</Link></Button>
                                            </div>
                                        )
                                    }

                                    <div className="flex flex-wrap items-center gap-2 md:flex-row ">
                                        <Button onClick={logoutHandler} className="cursor-pointer">Logout</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="ml-2"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className='md:hidden bg-white border-t border-gray-200 px-4 py-4'>
                    <ul className='flex flex-col font-medium items-start gap-4 cursor-pointer'>
                        {
                            user && user.role === "recruiter" ? (
                                <>
                                    <Link to="/admin/companies" className="hover:text-[#6A38C2] transition-colors w-full py-2">Companies</Link>
                                    <Link to="/admin/jobs" className="hover:text-[#6A38C2] transition-colors w-full py-2"> Jobs</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="hover:text-[#6A38C2] transition-colors w-full py-2">Home</Link>
                                    <Link to="/jobs" className="hover:text-[#6A38C2] transition-colors w-full py-2"> Jobs</Link>
                                    <Link to="/browse" className="hover:text-[#6A38C2] transition-colors w-full py-2"> Browse</Link>
                                </>
                            )
                        }
                    </ul>
                </div>
            )}
        </div>
    )
}
