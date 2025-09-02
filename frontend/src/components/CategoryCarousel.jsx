import React from 'react'
import { Carousel, CarouselContent,CarouselItem,CarouselNext,CarouselPrevious,} from "@/components/ui/carousel"
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]
export default function CategoryCarousel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
            <Carousel className="w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto my-10 sm:my-16 lg:my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                                <Button 
                                onClick={()=>searchJobHandler(cat)}
                                    variant="outline" 
                                    className="rounded-full cursor-pointer text-xs sm:text-sm w-full sm:w-auto px-3 sm:px-4 py-2"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>

                <CarouselPrevious className="cursor-pointer hidden sm:flex"/>
                <CarouselNext className="cursor-pointer hidden sm:flex"/>
            </Carousel>
        </div>
  )
}
