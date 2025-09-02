import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../redux/jobSlice';

export default function HeroSection() {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }

    return (
        <div className='text-center px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col gap-4 sm:gap-5 my-6 sm:my-8 lg:my-10'>
                <span className='mx-auto px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm sm:text-base'>No. 1 Job Search Website</span>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                    Search, Apply & <br className="hidden sm:block" /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
                </h1>
                <p className='w-full sm:w-[80%] md:w-[60%] lg:w-[40%] mx-auto text-sm sm:text-base lg:text-[17px] text-gray-600 leading-relaxed'>
                    Whether you're a candidate seeking the perfect opportunity or a recruiter searching for the ideal match, our platform connects ambition with opportunity.
                </p>
                <div className='flex w-full sm:w-[80%] md:w-[60%] lg:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2 sm:gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full text-sm sm:text-base py-2 sm:py-3'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] cursor-pointer px-3 sm:px-4 py-2 sm:py-3">
                        <Search className='h-4 w-4 sm:h-5 sm:w-5 cursor-pointer' />
                    </Button>
                </div>
            </div>
        </div>
    )
}
