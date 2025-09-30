import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from './ui/button'
import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import useSavedJobs from '../hooks/useSavedJobs'
import { setSearchedQuery } from '../redux/jobSlice'
import axios from 'axios'
import { JOB_API_ENDPOINT } from '../utils/constant'

export default function Jobs() {
  const JOB_CATEGORIES = [
    { value: "IT & Software Development", label: "IT & Software Development", icon: "💻" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering", icon: "🔧" },
    { value: "Civil Engineering", label: "Civil Engineering", icon: "🏗️" },
    { value: "Electrical & Electronics", label: "Electrical & Electronics", icon: "⚡" },
    { value: "Finance & Accounting", label: "Finance & Accounting", icon: "💰" },
    { value: "Sales & Marketing", label: "Sales & Marketing", icon: "📈" },
    { value: "Education & Training", label: "Education & Training", icon: "🎓" },
  ];
  
  useSavedJobs();
  const { allJobs = [] } = useSelector(store => store.job) || {};
  const dispatch = useDispatch();
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [filterJobs, setFilterJobs] = useState([]);

  // ✅ Fetch category counts only once
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axios.get(`${JOB_API_ENDPOINT}/category-counts`);
        if (response.data.success) {
          setCategoryCounts(response.data.categoryCounts);
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };
    fetchCategoryCounts();
  }, []);

  // ✅ Update jobs when category changes
  useEffect(() => {
    const fetchJobsByCategory = async () => {
      if (!selectedCategory || selectedCategory === "all") {
        setFilterJobs(allJobs);
        return;
      }
      try {
        const response = await axios.get(
          `${JOB_API_ENDPOINT}/get?category=${encodeURIComponent(selectedCategory)}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setFilterJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs by category:", error);
        setFilterJobs([]);
      }
    };

    fetchJobsByCategory();
  }, [selectedCategory, allJobs]);

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

        {/* Category Filter */}
        <div className='mb-4'>
          <span className='text-sm font-medium text-gray-700 block mb-2'>Browse by Category:</span>
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {JOB_CATEGORIES.map((category) => {
                const count = categoryCounts.find(c => c.category === category.value)?.count || 0;
                return (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                      <span className="text-gray-500 text-sm">({count})</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
                  {filterJobs.map((job) => (
                    <div key={job._id}>
                      <Job job={job} />
                    </div>
                  ))}
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
