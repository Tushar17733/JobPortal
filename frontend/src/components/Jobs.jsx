import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Filter } from 'lucide-react'
import useSavedJobs from '../hooks/useSavedJobs'

export default function Jobs() {
    useSavedJobs(); // Ensure saved jobs persist
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const [showFilters, setShowFilters] = useState(false);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    // Function to check if a job's salary falls within any of the selected ranges
    const isSalaryInRange = (jobSalary, salaryRanges) => {
        if (salaryRanges.length === 0) return true;
        return salaryRanges.some(range => {
            switch (range) {
                case "0-40k":
                    return jobSalary <= 0.4; // 40k = 0.4 LPA
                case "40k-1lakh":
                    return jobSalary > 0.4 && jobSalary <= 1; // 40k to 1 LPA
                case "1lakh to 5lakh":
                    return jobSalary > 1 && jobSalary <= 5; // 1 LPA to 5 LPA
                default:
                    return false;
            }
        });
    };

    // Function to check if a job matches any of the selected locations
    const matchesLocation = (jobLocation, locationFilters) => {
        if (locationFilters.length === 0) return true;
        return locationFilters.some(filter => 
            jobLocation.toLowerCase() === filter.toLowerCase()
        );
    };

    // Function to check if a job matches any of the selected industries
    const matchesIndustry = (jobTitle, industryFilters) => {
        if (industryFilters.length === 0) return true;
        return industryFilters.some(filter => 
            jobTitle.toLowerCase().includes(filter.toLowerCase())
        );
    };

    useEffect(() => {
        let filteredJobs = allJobs;

        // Apply search filter
        if (searchedQuery) {
            const searchTerms = searchedQuery.split(' ').filter(term => term.trim() !== '');
            
            // Define filter categories - updated to match FilterCard
            const salaryRanges = ["0-40k", "40k-1lakh", "1lakh to 5lakh"];
            const locations = ["Surat", "Bangalore", "Hyderabad", "US", "Mumbai"];
            const industries = ["Frontend Developer", "Backend Developer", "FullStack Developer"];

            // Categorize the search terms
            const salaryFilters = searchTerms.filter(term => salaryRanges.includes(term));
            const locationFilters = searchTerms.filter(term => locations.includes(term));
            const industryFilters = searchTerms.filter(term => industries.includes(term));
            const textSearchTerms = searchTerms.filter(term => 
                !salaryRanges.includes(term) && 
                !locations.includes(term) && 
                !industries.includes(term)
            );

            // Apply filters
            filteredJobs = allJobs.filter((job) => {
                // Apply salary filter
                if (salaryFilters.length > 0 && !isSalaryInRange(job.salary, salaryFilters)) {
                    return false;
                }

                // Apply location filter
                if (locationFilters.length > 0 && !matchesLocation(job.location, locationFilters)) {
                    return false;
                }

                // Apply industry filter
                if (industryFilters.length > 0 && !matchesIndustry(job.title, industryFilters)) {
                    return false;
                }

                // Apply text search filter
                if (textSearchTerms.length > 0) {
                    const jobText = `${job.title} ${job.description} ${job.location}`.toLowerCase();
                    return textSearchTerms.some(term => jobText.includes(term.toLowerCase()));
                }

                return true;
            });
        }

        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery]);

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
                        filterJobs.length <= 0 ? (
                            <div className='flex-1 flex items-center justify-center h-[50vh]'>
                                <span className='text-gray-500 text-lg'>Jobs not found</span>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <div key={job._id}>
                                                <Job job={job} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}
