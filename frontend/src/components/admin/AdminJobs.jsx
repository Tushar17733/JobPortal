import React from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '../../redux/jobSlice'

export default function AdminJobs() {
    useGetAllAdminJobs()
    const navigate = useNavigate();
    const [input, setInput] = useState("")
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchJobByText(input))
    }, [input])

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <Input
                        className="w-[240px]"
                        placeholder="Filter by name , role"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button className="cursor-pointer" onClick={() => navigate("/admin/jobs/create")}>Create new job</Button>
                </div>
                <br />
                <br />
                <AdminJobsTable />
            </div>
        </div>

    )
}
