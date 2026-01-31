import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className="w-full flex justify-center px-4 my-16">
      <div className="w-full max-w-6xl bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl flex flex-col md:flex-row items-center justify-between p-8 md:p-12 text-white">

        {/* Left Content */}
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Do you Own a Luxury Car?
          </h2>

          <p className="text-sm md:text-base mb-2">
            Monetize your vehicle effortlessly by listing it on CarRental.
          </p>

          <p className="text-sm md:text-base text-blue-100 max-w-md mb-6">
            We take care of insurance, driver verification and secure payments — so you can earn passive income, stress-free.
          </p>

          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition pointer-coarse:* "  >
            List your car
          </button>
        </div>

        {/* Right Image */}
        <div className="mt-8 md:mt-0 ">
          <img
            src={assets.banner_car_image}
            alt="car"
            className="w-full max-w-md object-contain"
          />
        </div>

      </div>
    </div>
  )
}

export default Banner
