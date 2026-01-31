import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();
  const available = car.isAvailable ?? car.isAvaliable;
  const seating = car.seatingCapacity ?? car.seating_capacity;
  const fuelType = car.fuelType ?? car.fuel_type;

  return (
    <div
      onClick={() => { navigate(`/car-details/${car._id}`); scrollTo(0, 0) }}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img src={car.image} alt="Car" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        {available && (
          <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Available Now
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
          {currency}{car.pricePerDay} / day
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{car.brand} {car.model}</h3>
        <p className="text-gray-500 text-sm">{car.category} · {car.year}</p>

        {/* Specs */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <img src={assets.users_icon} alt="seats" className="w-4 h-4"/>
            <span>{seating ?? '-'} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={assets.fuel_icon} alt="fuel" className="w-4 h-4"/>
            <span>{fuelType ?? '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={assets.car_icon} alt="transmission" className="w-4 h-4"/>
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={assets.location_icon} alt="location" className="w-4 h-4"/>
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
