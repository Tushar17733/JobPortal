import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { JOB_API_ENDPOINT } from '../../utils/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function PostJob() {
    const { companies } = useSelector(store => store.company);
    const location = useLocation();
    const editJobId = useMemo(() => new URLSearchParams(location.search).get('edit'), [location.search]);

    const JOB_CATEGORIES = [
        { value: "IT & Software Development", label: "IT & Software Development", icon: "💻" },
        { value: "Mechanical Engineering", label: "Mechanical Engineering", icon: "🔧" },
        { value: "Civil Engineering", label: "Civil Engineering", icon: "🏗️" },
        { value: "Electrical & Electronics", label: "Electrical & Electronics", icon: "⚡" },
        { value: "Finance & Accounting", label: "Finance & Accounting", icon: "💰" },
        { value: "Sales & Marketing", label: "Sales & Marketing", icon: "📈" },
        { value: "Education & Training", label: "Education & Training", icon: "🎓" },
      ];
      
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        category: ""
    });
    const selectedCompanyValue = useMemo(() => {
        const company = companies.find(c => c?._id === input.companyId);
        return company ? company.name.toLowerCase() : undefined;
    }, [companies, input.companyId]);
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

    const categoryChangeEventHandler = (value) => {
        setInput({ ...input, category: value });
    }
    const descriptionChangeHandler = (value) => {
        setInput({ ...input, description: value });
    }
    const payload = {
        ...input,
        salary: Number(input.salary),
        experience: Number(input.experience),
        position: Number(input.position),
    };

    useEffect(() => {
        const fetchAndPrefill = async () => {
            if (!editJobId) return;
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/${editJobId}`, { withCredentials: true });
                if (res.data?.success && res.data.job) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(',') : (job.requirements || ""),
                        salary: job.salary ?? "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel ?? "",
                        position: job.position ?? 0,
                        companyId: job.company?._id || job.company || "",
                        category: job.category || ""
                    });
                }
            } catch (err) {
                console.error('Failed to prefill job:', err);
            }
        };
        fetchAndPrefill();
    }, [editJobId]);

    const submitEventHandler = async (e) => {
        e.preventDefault();

        if (!input.companyId) {
            toast.error("Please select a company before posting a job");
            return;
        }

        if (!input.category) {
            toast.error("Please select a category before posting a job");
            return;
        }

        try {
            dispatch(setLoading(true));
            const endpoint = editJobId ? `${JOB_API_ENDPOINT}/update/${editJobId}` : `${JOB_API_ENDPOINT}/post`;
            const method = editJobId ? 'put' : 'post';
            const response = await axios[method](endpoint, input,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log(response)


            if (response.data.success) {
                toast.success(response.data.message || (editJobId ? "Job updated successfully" : "Job posted successfully"));
                navigate("/admin/jobs");
            } else {
                toast.error(response.data.message || (editJobId ? "Failed to update job" : "Failed to post job"));
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(errMsg);
            console.error("Job post error:", errMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-full my-5 px-4 sm:px-6 lg:px-8'>
                <form onSubmit={submitEventHandler} className='p-4 sm:p-6 lg:p-8 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-center sm:text-left'>{editJobId ? 'Edit Job' : 'Post New Job'}</h1>

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
                            <Label className="text-sm mb-2 sm:text-base">Description</Label>
                            <ReactQuill
                                value={input.description}
                                onChange={descriptionChangeHandler}
                                className="bg-white"
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
                        <div>
                            <Label className="text-sm sm:text-base mb-2 block">Select Category</Label>
                            <Select className="w-full cursor-pointer" value={input.category} onValueChange={categoryChangeEventHandler}>
                                <SelectTrigger className="w-full cursor-pointer text-sm sm:text-base">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            JOB_CATEGORIES.map((category) => {
                                                return (
                                                    <SelectItem
                                                        className="cursor-pointer"
                                                        key={category.value}
                                                        value={category.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span>{category.icon}</span>
                                                            <span>{category.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            companies.length !== 0 && (
                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="text-sm sm:text-base mb-2 block">Select Company</Label>
                                    <Select className="w-full cursor-pointer" value={selectedCompanyValue} onValueChange={selectChangeEventHandler}>
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
                            editJobId ? 'Save Changes' : "Post New Job"
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
