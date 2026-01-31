import React, { useEffect, useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { carsApi } from '../api'

function FeaturedSection() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    carsApi.getCars()
      .then((res) => {
        if (!cancelled) setCars(res.cars || [])
      })
      .catch(() => {
        if (!cancelled) setCars([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const featured = cars.slice(0, 6)

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="mb-10 text-center animate-fade-in">
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car, i) => (
            <div key={car._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center animate-fade-in">
        <button
          onClick={() => { navigate('/cars'); scrollTo(0, 0) }}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          Explore all cars
          <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection
