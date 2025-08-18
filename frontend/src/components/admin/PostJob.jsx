import React, { useState } from 'react'
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { JOB_API_ENDPOINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PostJob() {
    const { companies } = useSelector(store => store.company);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const navigate = useNavigate();
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const selectChangeEventHandler = (value) => {
        const company = companies.find(company => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: company?._id });
    }

    const submitEventHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${JOB_API_ENDPOINT}/post`, input,{
                 headers : {
                    'Content-type': 'application/json',
                },
                withCredentials: true
            });
            if(response.data.success){
                toast.success(response.data.message);
                navigate('/admin/jobs');
            }

        } catch (error) {
            console.log(error.response.data.message);
        }finally{
            dispatch(setLoading(false));
        }

    }
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-full my-5 px-4 sm:px-6 lg:px-8'>
                <form onSubmit={submitEventHandler} className='p-4 sm:p-6 lg:p-8 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-center sm:text-left'>Post New Job</h1>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5'>
                        <div>
                            <Label className="text-sm sm:text-base">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <Label className="mb-[10px] text-sm sm:text-base">Description</Label>
                            <textarea
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">Salary <span className='text-xs text-gray-500'>(in LPA)</span></Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">Experience Level <span className='text-xs text-gray-500'>(in years)</span></Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <Label className="text-sm sm:text-base">No of Position</Label>
                            <Input
                                type='number'
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 text-sm sm:text-base"
                            />
                        </div>
                        {
                            companies.length !== 0 && (
                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="text-sm sm:text-base mb-2 block">Select Company</Label>
                                    <Select className="w-full cursor-pointer" onValueChange={selectChangeEventHandler}>
                                        <SelectTrigger className="w-full cursor-pointer text-sm sm:text-base">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies && companies.map((company) => {
                                                        return (
                                                            <SelectItem
                                                            className="cursor-pointer"
                                                                key={company?._id}
                                                                value={company?.name.toLowerCase()}
                                                            >
                                                                {company?.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }

                    </div>

                    <Button type="submit" disabled={companies?.length === 0 ? true : false} className='w-full mt-4 sm:mt-6 cursor-pointer text-sm sm:text-base'>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : (
                            "Post New Job"
                        )}
                    </Button>
                    
                    {
                        companies.length === 0 && (
                            <p className='text-red-600 text-xs sm:text-sm font-bold text-center my-3'>
                                *Please register a company first.
                            </p>
                        )
                    }
                </form>
            </div>
        </div>
    )
}
