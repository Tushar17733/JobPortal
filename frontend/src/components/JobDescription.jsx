import { Badge } from './ui/badge';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Navbar from './shared/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_API_ENDPOINT, JOB_API_ENDPOINT } from '../utils/constant';
import axios from 'axios';
import { setSingleJob } from '../redux/jobSlice';
import { toast } from 'sonner';

export default function JobDescription() {
    const params = useParams()
    const jobId = params.id;
    const { singlejob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const isInitiallyApplied = singlejob?.applications?.some(app => app.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied)

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_ENDPOINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singlejob, applications: [...singlejob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6'>
                    <div className="flex-1">
                        <h1 className='font-bold text-lg sm:text-xl lg:text-2xl'>{singlejob?.title}</h1>
                        <div className='flex flex-wrap items-center gap-2 mt-3 sm:mt-4'>
                            <Badge className={'text-blue-700 font-bold text-xs'} variant="ghost">{singlejob?.position} Positions</Badge>
                            <Badge className={'text-[#F83002] font-bold text-xs'} variant="ghost">{singlejob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold text-xs'} variant="ghost">{singlejob?.salary} LPA</Badge>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (!user) {
                                navigate("/login"); // redirect to login page
                            } else if (!isApplied) {
                                applyJobHandler();
                            }
                        }}
                        disabled={isApplied}
                        className={`rounded-lg text-sm sm:text-base w-full sm:w-auto ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad] cursor-pointer'}`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>
                
                <h1 className='border-b-2 border-b-gray-300 font-medium py-3 sm:py-4 text-base sm:text-lg mt-6 sm:mt-8'>Job Description</h1>
                
                <div className='my-4 sm:my-6 space-y-3 sm:space-y-4'>
                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Role:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.title}</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Location:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.location}</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Description:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.description}</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Experience:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.experienceLevel} yrs</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Salary:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.salary} LPA</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Total Applicants:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.applications?.length}</span>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                        <h1 className='font-bold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]'>Posted Date:</h1>
                        <span className='font-normal text-gray-800 text-sm sm:text-base'>{singlejob?.createdAt.split("T")[0]}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
