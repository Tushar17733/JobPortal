import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { setSearchedQuery } from '../redux/jobSlice';

export default function FilterCard() {

  const filterData = [
    {
      filterType: "Location",
      array: ["Surat", "Bangalore", "Hyderabad", "US", "Mumbai"]
    },
    {
      filterType: "Industry",
      array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
      filterType: "Salary",
      array: ["0-40k", "40k-1lakh", "1lakh to 5lakh"]
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    Location: [],
    Industry: [],
    Salary: []
  });
  const dispatch = useDispatch();

  const changeHandler = (value, filterType) => {
    setSelectedFilters(prev => {
      const currentArray = prev[filterType];
      const isSelected = currentArray.includes(value);
      
      if (isSelected) {
        // Remove the value if it's already selected
        return {
          ...prev,
          [filterType]: currentArray.filter(item => item !== value)
        };
      } else {
        // Add the value if it's not selected
        return {
          ...prev,
          [filterType]: [...currentArray, value]
        };
      }
    });
  };

  useEffect(() => {
    // Combine all selected filters into a search query
    const allFilters = [];
    Object.values(selectedFilters).forEach(filterArray => {
      allFilters.push(...filterArray);
    });
    const searchQuery = allFilters.join(' ');
    dispatch(setSearchedQuery(searchQuery));
  }, [selectedFilters, dispatch]);

  return (
    <div className='w-full bg-white p-3 sm:p-4 rounded-md shadow-sm border border-gray-100'>
      <h1 className='font-bold text-base sm:text-lg mb-3'>Filter Jobs</h1>
      <hr className='mb-4' />
      
      {filterData.map((data, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <h2 className='font-bold text-sm sm:text-base mb-2 text-gray-800'>{data.filterType}</h2>
          <div className="space-y-1">
            {
              data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`
                const isSelected = selectedFilters[data.filterType].includes(item);
                return (
                  <div key={idx} className='flex items-center space-x-2 my-1 sm:my-2 cursor-pointer hover:bg-gray-50 p-1 rounded'>
                    <input
                      type="checkbox"
                      id={itemId}
                      checked={isSelected}
                      onChange={() => changeHandler(item, data.filterType)}
                      className="cursor-pointer"
                    />
                    <Label htmlFor={itemId} className="cursor-pointer text-xs sm:text-sm text-gray-700">{item}</Label>
                  </div>
                )
              })
            }
          </div>
        </div>
      ))}
    </div>
  )
}
