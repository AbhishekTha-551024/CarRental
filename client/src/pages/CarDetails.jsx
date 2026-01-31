import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../component/Loader'
import { carsApi, bookingApi } from '../api'
import { useAuth } from '../context/AuthContext'

const CarDetails = ({ setShowLogin }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { car: data } = await carsApi.getCarById(id)
        if (!cancelled) setCar(data)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Car not found')
          setCar(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Loader />
  if (error || !car) return <div className="px-4 py-8"><p className="text-red-600">{error || "Car not found"}</p><button onClick={() => navigate(-1)} className="mt-4 text-blue-600">Back</button></div>

  const seating = car.seatingCapacity ?? car.seating_capacity
  const fuelType = car.fuelType ?? car.fuel_type

  const today = new Date().toISOString().split('T')[0]

  const handleBookSubmit = async (e) => {
    e.preventDefault()
    setBookingError('')
    if (!user) {
      setShowLogin?.(true)
      return
    }
    if (!pickupDate || !returnDate) {
      setBookingError('Please select both pickup and return dates.')
      return
    }
    if (returnDate <= pickupDate) {
      setBookingError('Return date must be after pickup date.')
      return
    }
    if (pickupDate < today) {
      setBookingError('Pickup date cannot be in the past.')
      return
    }
    setBookingLoading(true)
    try {
      await bookingApi.create({
        car: id,
        pickupDate: new Date(pickupDate).toISOString(),
        returnDate: new Date(returnDate).toISOString(),
      })
      navigate('/my-bookings')
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Try different dates.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <img src={assets.arrow_icon} alt="back" className="w-4 rotate-180" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          {/* Car Image */}
          <img
            src={car.image}
            alt="car"
            className="w-full h-80 object-cover rounded-xl shadow"
          />

          {/* Car Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500">
                {car.category} · {car.year}
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${seating ?? '-'} Seats` },
                { icon: assets.fuel_icon, text: fuelType ?? '-' },
                { icon: assets.car_icon, text: car.transmission ?? '-' },
                { icon: assets.location_icon, text: car.location ?? '-' }
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-600">
                  <img src={icon} alt="" className="w-5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Features</h2>
              <ul className="grid grid-cols-2 gap-3">
                {["360 Camera", "Bluetooth", "GPS"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-600">
                    <img src={assets.check_icon} alt="" className="w-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – Booking */}
        <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Book this car</h2>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500">Price per day</span>
            <span className="text-2xl font-semibold">
              ₹{car.pricePerDay}
            </span>
          </div>

          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Log in to book this car.</p>
              <button
                type="button"
                onClick={() => setShowLogin?.(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
              >
                Login to Book
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup date</label>
                <input
                  type="date"
                  min={today}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return date</label>
                <input
                  type="date"
                  min={pickupDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>
              {bookingError && (
                <p className="text-sm text-red-600">{bookingError}</p>
              )}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}

export default CarDetails
