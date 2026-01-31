import React from 'react'

const Newsletter = () => {
  return (
    <div className="mt-16 md:mt-24 px-4">
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        
        <h1 className="text-2xl md:text-4xl font-semibold">
          Never Miss a Deal!
        </h1>

        <p className="text-sm md:text-lg text-gray-500/70 pb-8 max-w-xl">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts
        </p>

        <form className="flex items-center justify-between max-w-2xl w-full h-12 md:h-14">
          <input
            className="border border-gray-300 h-full w-full px-4 text-gray-600 outline-none rounded-l-md"
            type="email"
            placeholder="Enter your email id"
            required
          />
          <button
            type="submit"
            className="h-full px-8 md:px-12 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-r-md transition"
          >
            Subscribe
          </button>
        </form>

      </div>
    </div>
  )
}

export default Newsletter
