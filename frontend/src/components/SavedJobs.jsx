import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import Footer from './shared/Footer'
import useSavedJobs from '../hooks/useSavedJobs'

export default function SavedJobs() {
    const { savedJobs = [] } = useSavedJobs();

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-lg sm:text-xl lg:text-2xl my-6 sm:my-8 lg:my-10 text-center sm:text-left'>
                    Saved Jobs ({savedJobs?.length || 0})
                </h1>
                
                {(!savedJobs || savedJobs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">No saved jobs yet</h2>
                        <p className="text-gray-500 text-center max-w-md">
                            Start saving jobs you're interested in by clicking the bookmark icon or Save button on jobs page.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                        {savedJobs.map((job) => (
                            <Job key={job._id} job={job} isSaved={true} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
