import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Filter } from 'lucide-react'

export default function Jobs() {
const {allJobs} = useSelector(store=>store.job)
const [showFilters, setShowFilters] = useState(false);

    return (
        <div>
            <Navbar />
            <div className='max-w-[1400px] mx-auto mt-4 sm:mt-6 mb-5 px-4 sm:px-6 lg:px-8'>
                {/* Mobile Filter Toggle */}
                <div className='lg:hidden mb-4'>
                    <Button 
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-5'>
                    {/* Filter Sidebar */}
                    <div className={`lg:w-[18%] ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <FilterCard />
                    </div>
                    
                    {/* Jobs Grid */}
                    {
                        allJobs.length <= 0 ? (
                            <div className='flex-1 flex items-center justify-center h-[50vh]'>
                                <span className='text-gray-500 text-lg'>Jobs not found</span>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                                    {
                                        allJobs.map((job) => (
                                            <div key={job._id}>
                                                <Job job={job}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}
