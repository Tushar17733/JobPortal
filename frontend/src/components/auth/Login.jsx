import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group.jsx"
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "sonner"
import { USER_API_ENDPOINT } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice';
import { Loader2 } from 'lucide-react'
import { clearJobs } from '../../redux/jobSlice'
import { clearCompany } from '../../redux/companySlice'
import { clearApplicants } from '../../redux/applicationSlice'

export default function Login() {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "candidate"
    });
    const navigate = useNavigate()
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const SubmitHandler = async (e) => {
        e.preventDefault()
        try {
            dispatch(setLoading(true))
            
            // Clear any existing Redux data before login to ensure clean state
            dispatch(clearJobs());
            dispatch(clearCompany());
            dispatch(clearApplicants());
            
            const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                if (res.data.user.role === "recruiter") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Registration failed!");
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <form onSubmit={SubmitHandler} className='w-full sm:w-[80%] md:w-[60%] lg:w-1/2 border border-gray-200 rounded-md p-4 sm:p-6 lg:p-8 my-6 sm:my-8 lg:my-10 shadow-lg'>
                    <h1 className='font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-5 text-center sm:text-left'>Login</h1>

                    <div className='my-2 sm:my-3'>
                        <Label className="text-sm sm:text-base">Email</Label>
                        <Input
                            type="email"
                            placeholder="abc@gmail.com"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="mt-[10px] mb-[15px] text-sm sm:text-base"
                        />
                    </div>

                    <div className='my-2 sm:my-3'>
                        <Label className="text-sm sm:text-base">Password</Label>
                        <Input
                            type="password"
                            placeholder="abc123"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="mt-[10px] mb-[15px] text-sm sm:text-base"
                        />
                    </div>
                    
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                        <RadioGroup className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 my-3 sm:my-5">
                            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={input.role === 'candidate'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"

                                />
                                <Label htmlFor="r1" className="cursor-pointer text-sm sm:text-base">Candidate</Label>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2" className="cursor-pointer text-sm sm:text-base">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    {
                        loading ? (
                            <Button className="w-full my-3 sm:my-4 text-sm sm:text-base"> 
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-3 sm:my-4 cursor-pointer text-sm sm:text-base">Login</Button>
                        )
                    }
                    
                    <span className='text-xs sm:text-sm text-center sm:text-left block'>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800 transition-colors">
                            Register/Signup
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    )
}
