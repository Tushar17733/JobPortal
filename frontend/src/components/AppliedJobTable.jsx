import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

export default function AppliedJobTable() {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption className="text-sm sm:text-base">A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Job Role</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Company</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {[1, 2].map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-xs sm:text-sm">17-07-2024</TableCell>
                            <TableCell className="text-xs sm:text-sm font-medium">Frontend Developer</TableCell>
                            <TableCell className="text-xs sm:text-sm hidden sm:table-cell">Google</TableCell>
                            <TableCell className="text-right">
                                <Badge className="text-xs">Selected</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
