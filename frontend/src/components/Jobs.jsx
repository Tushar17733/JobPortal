import React from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useSelector } from 'react-redux'

export default function Jobs() {
const {allJobs} = useSelector(store=>store.job)

    return (
        <div>
            <Navbar />
            <div className='max-w-[1400px] mx-auto mt-6 mb-5'>
                <div className='flex gap-5'>
                    <div className='w-[18%]'>
                        <FilterCard />
                    </div>
                    {
                        allJobs.length <= 0 ? (
                            <span>Jobs not found</span>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
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
