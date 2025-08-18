import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '../ui/avatar';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompaniesTable() {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = Array.isArray(companies) ? companies.filter((company) => {
                if (!searchCompanyByText) {
                    return true;
                }
                return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
            })
            : [];

        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);


    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption className="mt-[25px] text-sm sm:text-base">A list of your recent register companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs sm:text-sm">Logo</TableHead>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        Array.isArray(filterCompany) && filterCompany.map((company) => (
                            <tr key={company._id} className='hover:bg-gray-50'>
                                <TableCell>
                                    <Avatar className='h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24'>
                                        <AvatarImage 
                                            className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full" 
                                            src={company.logo || "https://icons.veryicon.com/png/o/miscellaneous/zr_icon/company-23.png"} 
                                        />
                                    </Avatar>
                                </TableCell>

                                <TableCell className="text-xs sm:text-sm font-medium">{company.name}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{company.createdAt.split("T")[0]}</TableCell>

                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </PopoverTrigger>

                                        <PopoverContent className="w-32">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                                className="flex items-center gap-2 w-fit cursor-pointer hover:bg-gray-100 p-1 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span className="text-sm">Edit</span>
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
