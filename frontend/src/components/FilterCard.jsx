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
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3' />
      <RadioGroup>
        {
          filterData.map((data, index) => (
            <div>
              <h1 className='font-bold text-lg'>{data.filterType}</h1>
              {
                data.array.map((item, idx) => {
                  return (
                    <div className='flex items-center space-x-2 my-2 cursor-pointer'>
                      <RadioGroupItem value={item} className="cursor-pointer"/>
                      <Label className="cursor-pointer">{item}</Label>
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
