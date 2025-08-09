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
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="cursor-pointer" onClick={() => navigate("/admin/companies/create")}>New Company</Button>
        </div>
        <br />
        <br />
        <CompaniesTable />
      </div>
    </div>

  )
}
