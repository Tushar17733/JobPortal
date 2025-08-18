import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { COMPANY_API_ENDPOINT } from '../utils/constant';
import useGetCompanyById from '../hooks/useGetCompanyById';
import { setLoading } from '../redux/authSlice';

export default function CompanySetup() {
    const params = useParams();
    useGetCompanyById(params.id);
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch()

    const navigate = useNavigate();
    const { singleCompany } = useSelector(store => store.company);

    const [input, setInput] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        file: null,
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        dispatch(setLoading(true));

        const formData = new FormData();
        formData.append('name', input.name);
        formData.append('description', input.description);
        formData.append('website', input.website);
        formData.append('location', input.location);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            const res = await axios.put(`${COMPANY_API_ENDPOINT}/update/${params.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setLoading(false)); // stop loader BEFORE navigating
                navigate("/admin");
            } else {
                toast.error("Something went wrong!");
                dispatch(setLoading(false));
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error updating company");
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany?.name || "",
            description: singleCompany?.description || "",
            website: singleCompany?.website || "",
            location: singleCompany?.location || "",
            file: singleCompany?.file || null
        });
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-3xl mx-auto my-6 sm:my-8 lg:my-10 px-4 sm:px-6 lg:px-8'>
                <form className='shadow-lg p-4 sm:p-6 lg:p-8 rounded-lg' onSubmit={submitHandler}>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-6 sm:mb-8 lg:mb-10'>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/admin")}
                            className='flex items-center gap-2 text-gray-500 font-semibold cursor-pointer w-fit'
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">Back</span>
                        </Button>
                        <h1 className='font-bold text-lg sm:text-xl lg:text-2xl sm:ml-auto'>Company Setup</h1>
                    </div>

                    {/* Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
                        {/* Company Name */}
                        <div>
                            <Label className="mb-2 sm:mb-[10px] text-sm sm:text-base">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <Label className="mb-2 sm:mb-[10px] text-sm sm:text-base">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>

                        {/* Description - Full Width */}
                        <div className="col-span-1 sm:col-span-2">
                            <Label className="mb-2 sm:mb-[10px] text-sm sm:text-base">Description</Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
                            />
                        </div>

                        {/* Logo */}
                        <div>
                            <Label className="mb-2 sm:mb-[10px] text-sm sm:text-base">Logo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="text-xs sm:text-sm"
                            />
                        </div>

                        {/* Location (to the right of Logo) */}
                        <div>
                            <Label className="mb-2 sm:mb-[10px] text-sm sm:text-base">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" disabled={loading} className="w-full mt-6 sm:mt-8 cursor-pointer text-sm sm:text-base">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
