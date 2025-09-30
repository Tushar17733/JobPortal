import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoreHorizontal } from 'lucide-react'
import { Check, X, MessageCircle } from "lucide-react";
import { useSelector } from 'react-redux';
import { APPLICATION_API_ENDPOINT, USER_API_ENDPOINT } from '../../utils/constant';

const MESSAGING_API_ENDPOINT = "http://localhost:8000/api/v1/messaging";
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const shortlistingStatus = ["accepted", "rejected"];
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

    const startChat = async (applicantId, applicantName) => {
        try {
            const res = await axios.post(`${MESSAGING_API_ENDPOINT}/conversations/start`, {
                candidateId: applicantId,
                jobId: applicants._id
            }, {
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(`Chat started with ${applicantName}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to start chat');
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
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
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
                                <TableCell className="text-xs sm:text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        item.status === 'accepted' 
                                            ? 'bg-green-100 text-green-800' 
                                            : item.status === 'rejected' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div 
                                                        onClick={() => statusHandler(status,item?._id)} 
                                                        key={index} 
                                                        className='flex w-fit items-center my-2 cursor-pointer gap-2 hover:bg-gray-100 p-1 rounded'
                                                    >
                                                        {status === "accepted" ? (
                                                            <Check className="text-green-500 w-4 h-4" />
                                                        ) : (
                                                            <X className="text-red-500 w-4 h-4" />
                                                        )}
                                                        <span className="text-sm">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                                    </div>
                                                ))
                                            }
                                            {item.status === 'accepted' && (
                                                <div 
                                                    onClick={() => startChat(item?.applicant?._id, item?.applicant?.fullName)} 
                                                    className='flex w-fit items-center my-2 cursor-pointer gap-2 hover:bg-gray-100 p-1 rounded'
                                                >
                                                    <MessageCircle className="text-blue-500 w-4 h-4" />
                                                    <span className="text-sm">Start Chat</span>
                                                </div>
                                            )}
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