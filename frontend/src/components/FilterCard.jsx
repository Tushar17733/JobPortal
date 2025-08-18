import React from 'react'
import {RadioGroup,RadioGroupItem} from './ui/radio-group'
import { Label } from './ui/label';
export default function FilterCard() {
  
  const filterData = [
    {
      filterType: "Location",
      array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
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

  return (
    <div className='w-full bg-white p-3 sm:p-4 rounded-md shadow-sm border border-gray-100'>
      <h1 className='font-bold text-base sm:text-lg mb-3'>Filter Jobs</h1>
      <hr className='mb-4' />
      <RadioGroup>
        {
          filterData.map((data, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h2 className='font-bold text-sm sm:text-base mb-2 text-gray-800'>{data.filterType}</h2>
              {
                data.array.map((item, idx) => {
                  return (
                    <div key={idx} className='flex items-center space-x-2 my-1 sm:my-2 cursor-pointer hover:bg-gray-50 p-1 rounded'>
                      <RadioGroupItem value={item} className="cursor-pointer"/>
                      <Label className="cursor-pointer text-xs sm:text-sm text-gray-700">{item}</Label>
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}
