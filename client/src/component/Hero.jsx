import React, { useState } from "react"
import { assets, cityList } from "../assets/assets"

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-center">
        Luxury Cars on Rent
      </h1>
      <p className="text-gray-500 mb-10 text-center max-w-xl">
        Book premium cars effortlessly for your next journey
      </p>

      {/* Search Bar */}
      <form className="w-full max-w-5xl bg-white rounded-2xl shadow-xl px-6 py-6 flex flex-col sm:flex-row items-center gap-6">

        {/* Pickup Location */}
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="text-sm text-gray-600 outline-none border border-gray-200 rounded-lg px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          >
            <option value="">Select location</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date */}
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Pick-up Date
          </label>
          <input
            type="date"
            value={pickupDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setPickupDate(e.target.value)}
            className="text-sm text-gray-600 outline-none border border-gray-200 rounded-lg px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        {/* Return Date */}
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Return Date
          </label>
          <input
            type="date"
            value={returnDate}
            min={pickupDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setReturnDate(e.target.value)}
            className="text-sm text-gray-600 outline-none border border-gray-200 rounded-lg px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 transition-all duration-300 text-white px-8 py-3 rounded-xl flex items-center gap-2 mt-2 sm:mt-6 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="h-4 brightness-200"
          />
          Search
        </button>

      </form>
    </div>
  )
}

export default Hero
