import React from 'react'

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-500 text-sm">
          Loading, please wait...
        </p>

      </div>
    </div>
  )
}

export default Loader
