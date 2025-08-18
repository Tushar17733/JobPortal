import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '../../redux/companySlice'
import axios from 'axios'
import { COMPANY_API_ENDPOINT } from '../../utils/constant'
import { toast } from 'sonner'

export default function CompanyCreate() {
    const [companyName, setCompanyName] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_ENDPOINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company))
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='my-6 sm:my-8 lg:my-10'>
                    <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3'>Your Company Name</h1>
                    <p className='text-gray-500 text-sm sm:text-base'>What would you like to give your company name? you can change this later</p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base">Company Name</Label>
                    <Input
                        type="text"
                        className="text-sm sm:text-base"
                        placeholder="Google, Microsoft etc."
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 my-6 sm:my-8 lg:my-10'>
                    <Button 
                        className="cursor-pointer text-sm sm:text-base w-full sm:w-auto" 
                        variant="outline" 
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={registerNewCompany} 
                        className="cursor-pointer text-sm sm:text-base w-full sm:w-auto"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
