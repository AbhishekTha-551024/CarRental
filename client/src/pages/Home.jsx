import React from 'react'
import Hero from '../component/Hero'
import Cars from './Cars'
import FeaturedSection from '../component/FeaturedSection'
import Banner from '../component/Banner'
import Testimonial from '../component/Testimonial'
import Newsletter from '../component/Newsletter'
import Footer from '../component/Footer'

const Home = () => {
  return (
    <>
      <Hero/>
      <FeaturedSection/>
      <Banner/>
      <Testimonial/>
      <Newsletter/>
      
    </>
  )
}

export default Home
