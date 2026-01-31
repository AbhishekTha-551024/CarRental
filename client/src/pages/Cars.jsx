import React, { useState, useEffect } from 'react'
import Title from '../component/Title'
import { assets } from '../assets/assets'
import CarCard from '../component/CarCard'
import { carsApi } from '../api'

const Cars = () => {
  const [input, setInput] = useState('')
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { cars: list } = await carsApi.getCars()
        setCars(list || [])
      } catch (err) {
        setError(err.message || 'Failed to load cars')
        setCars([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredCars = cars.filter((car) =>
    `${car.brand || ''} ${car.model || ''} ${car.category || ''}`
      .toLowerCase()
      .includes(input.toLowerCase())
  )

  return (
    <div className="px-6 py-10">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {loading && <p className="text-sm text-gray-500 mb-2">Loading cars...</p>}
      <Title
        title="Available Cars"
        subTitle="Browse our selection of premium vehicles available for your next adventure"
      />

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-xl mx-auto mt-8 bg-white shadow px-4 py-2 rounded-full">

        <img src={assets.search_icon} alt="search" className="h-4" />

        <input
          type="text"
          placeholder="Search by make, model, or features"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 outline-none text-sm"
        />

        <img src={assets.filter_icon} alt="filter" className="h-4 cursor-pointer" />
      </div>

      {/* Results */}
      <div className="mt-10">

        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredCars.length} cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))
          ) : (
            <p className="text-gray-500">No cars found</p>
          )}

        </div>
      </div>

    </div>
  )
}

export default Cars
