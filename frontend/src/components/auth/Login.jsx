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

export default function Login() {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const navigate = useNavigate()
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const SubmitHandler = async (e) => {
        e.preventDefault()
        try {
            dispatch(setLoading(true))
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
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={SubmitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>


                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="abc@gmail.com"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="mt-[10px] mb-[15px]"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="abc123"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="mt-[10px] mb-[15px]"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={input.role === 'candidate'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"

                                />
                                <Label htmlFor="r1" className="cursor-pointer">Candidate</Label>
                            </div>
                            <div className="flex items-center gap-3 cursor-pointer">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2" className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>

                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 cursor-pointer">Login</Button>
                    }
                    <span className='text-sm'>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600">
                            Register/Signup
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    )
}
