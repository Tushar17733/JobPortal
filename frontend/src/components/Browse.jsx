import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import Footer from './shared/Footer'

export default function Browse() {
    const randomJobs = [1, 2, 3, 4, 5]

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-lg sm:text-xl lg:text-2xl my-6 sm:my-8 lg:my-10 text-center sm:text-left'>
                    Search Results ({randomJobs.length})
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                    {
                        randomJobs.map((item, index) => {
                            return (
                                <Job key={index} />
                            )
                        })
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}
