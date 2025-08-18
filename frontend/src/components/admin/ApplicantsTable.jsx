import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoreHorizontal } from 'lucide-react'
import { Check, X } from "lucide-react";
import { useSelector } from 'react-redux';
import { APPLICATION_API_ENDPOINT } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'sonner';

const shortlistingStatus = ["Accepted", "Rejected"];
const ApplicantsTable = () => {

    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption className="text-sm sm:text-base">A list of applied candidates for this job</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs sm:text-sm">FullName</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Contact</TableHead>
                        <TableHead className="text-xs sm:text-sm">Resume</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants.applications?.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                <TableCell className="text-xs sm:text-sm font-medium">{item?.applicant?.fullName}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{item?.applicant?.email}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <a 
                                        className="text-blue-700 cursor-pointer hover:text-blue-900 transition-colors break-all" 
                                        href={item?.applicant?.profile?.resume}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName || <span>N/A</span>}
                                    </a>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm hidden md:table-cell">{applicants?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div 
                                                        onClick={() => statusHandler(status,item?._id)} 
                                                        key={index} 
                                                        className='flex w-fit items-center my-2 cursor-pointer gap-2 hover:bg-gray-100 p-1 rounded'
                                                    >
                                                        {status === "Accepted" ? (
                                                            <Check className="text-green-500 w-4 h-4" />
                                                        ) : (
                                                            <X className="text-red-500 w-4 h-4" />
                                                        )}
                                                        <span className="text-sm">{status}</span>
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell >
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable;