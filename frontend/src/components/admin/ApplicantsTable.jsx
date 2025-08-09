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
        <div>
            <Table>
                <TableCaption>A list of applied candidates for this job</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullName}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    <a className="text-blue-700 cursor-pointer" href={item?.applicant?.profile?.resume}
                                        target="_blank" >
                                        {item?.applicant?.profile?.resumeOriginalName || <span>N/A</span>}
                                    </a>
                                </TableCell>
                                <TableCell>{applicants?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div onClick={() => statusHandler(status,item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer gap-2'>
                                                        {status === "Accepted" ? (
                                                            <Check className="text-green-500 w-4 h-4" />
                                                        ) : (
                                                            <X className="text-red-500 w-4 h-4" />
                                                        )}
                                                        <span>{status}</span>
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