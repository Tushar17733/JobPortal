import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '../hooks/useGetAllJobs'
import useSavedJobs from '../hooks/useSavedJobs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Home() {

  useGetAllJobs();
  useSavedJobs(); // Ensure saved jobs persist
  
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
      <Footer/>
    </div>
  )
}
