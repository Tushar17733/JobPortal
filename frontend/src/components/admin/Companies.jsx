import React from 'react'
import Navbar from '../shared/Navbar'
import CompaniesTable from './CompaniesTable'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '../../hooks/useGetAllCompanies'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '../../redux/companySlice'

export default function Companies() {
  useGetAllCompanies();
  const navigate = useNavigate();
  const [input, setInput] = useState("")
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input))
  }, [input])
  
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6'>
          <Input
            className="w-full sm:w-fit text-sm sm:text-base"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="cursor-pointer text-sm sm:text-base w-full sm:w-auto" 
            onClick={() => navigate("/admin/companies/create")}
          >
            New Company
          </Button>
        </div>
        <div className="mt-6 sm:mt-8">
          <CompaniesTable />
        </div>
      </div>
    </div>
  )
}
