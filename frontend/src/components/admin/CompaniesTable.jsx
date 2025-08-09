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
        <div>
            <Table>
                <TableCaption className="mt-[25px]">A list of your recent register companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {
                        Array.isArray(filterCompany) && filterCompany.map((company) => (
                            <tr className=''>
                                <TableCell>
                                    <Avatar className='h-24 w-24'>
                                        <AvatarImage className="h-[50px] w-[50px]" src={company.logo || "https://icons.veryicon.com/png/o/miscellaneous/zr_icon/company-23.png"} />
                                    </Avatar>
                                </TableCell>

                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>

                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>

                                        <PopoverContent className="w-32">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
                                                <Edit2 className="w-4" />
                                                <span>Edit</span>
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
