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
            <div className='max-w-3xl mx-auto my-10'>
                <form className='shadow-lg p-8' onSubmit={submitHandler}>
                    {/* Header */}
                    <div className='flex items-center gap-5 mb-10'>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/admin")}
                            className='flex items-center gap-2 text-gray-500 font-semibold cursor-pointer'
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl ml-[170px]'>Company Setup</h1>
                    </div>

                    {/* Grid */}
                    <div className='grid grid-cols-2 gap-8'>
                        {/* Company Name */}
                        <div>
                            <Label className="mb-[10px]">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <Label className="mb-[10px]">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>

                        {/* Description - Full Width */}
                        <div className="col-span-2">
                            <Label className="mb-[10px]">Description</Label>
                            <textarea
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"

                            />
                        </div>

                        {/* Logo */}
                        <div>
                            <Label className="mb-[10px]">Logo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                            />
                        </div>

                        {/* Location (to the right of Logo) */}
                        <div>
                            <Label className="mb-[10px]">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    {/* {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full mt-8 cursor-pointer">Update</Button>
                    } */}
                    <Button type="submit" disabled={loading} className="w-full mt-8 cursor-pointer">
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
