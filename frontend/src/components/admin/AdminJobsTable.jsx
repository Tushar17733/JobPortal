import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '../ui/avatar';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminJobsTable() {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = Array.isArray(allAdminJobs) ? allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
    }) : [];

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="mt-[25px] text-sm sm:text-base">A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Company Name</TableHead>
            <TableHead className="text-xs sm:text-sm">Role</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            Array.isArray(filterJobs) && filterJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <TableCell className="text-xs sm:text-sm font-medium">{job?.company?.name}</TableCell>
                <TableCell className="text-xs sm:text-sm">{job?.title}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{job?.createdAt.split("T")[0]}</TableCell>

                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                    </PopoverTrigger>

                    <PopoverContent className="w-32">
                      <div 
                        onClick={() => navigate(`/admin/jobs/create`)} 
                        className="flex items-center gap-2 w-fit cursor-pointer hover:bg-gray-100 p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </div>
                      <div 
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                        className='flex items-center w-fit gap-2 cursor-pointer mt-2 hover:bg-gray-100 p-1 rounded'
                      >
                        <Eye className='w-4 h-4' />   
                        <span className="text-sm">Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}
