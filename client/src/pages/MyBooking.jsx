import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '../component/Title'
import { bookingApi } from '../api'

const MyBooking = ({ setShowLogin }) => {
  const [booking, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  const fetchMyBooking = async () => {
    setLoading(true)
    setError('')
    setIsUnauthorized(false)
    try {
      const { bookings } = await bookingApi.getMyBookings()
      setBookings(bookings || [])
    } catch (err) {
      const msg = err.message || 'Failed to load bookings'
      setError(msg)
      setBookings([])
      if (msg.toLowerCase().includes('authorized') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('401')) {
        setIsUnauthorized(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBooking()
  }, [])

  const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : '')

  return (
    <div className="px-4 md:px-10 py-6">
      <Title
        title="My Booking"
        subTitle="View and manage your all car bookiings"
        align="left"
      />

      {error && !isUnauthorized && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {isUnauthorized && (
        <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-gray-700 mb-3">Please log in to view your bookings.</p>
          <button
            type="button"
            onClick={() => setShowLogin?.(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Login
          </button>
        </div>
      )}
      {loading ? (
        <p className="mt-6 text-gray-500">Loading bookings...</p>
      ) : !isUnauthorized && (
      <div className="mt-6 space-y-6">
        {booking.length === 0 ? (
          <div className="p-8 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 mb-4">No bookings yet.</p>
            <Link
              to="/cars"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Browse cars
            </Link>
          </div>
        ) : (
        booking.map((item, index) => (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="md:col-span-1">
              <div className="w-full h-36 rounded-lg overflow-hidden">
                <img
                  src={item.car?.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col justify-center">
              <p className="text-xl font-semibold text-gray-800">
                {item.car?.brand} {item.car?.model}
              </p>
              <p className="text-gray-500 mt-1">
                {item.car?.year} • {item.car?.category} • {item.car?.location}
              </p>
              <p className="mt-2 font-medium text-gray-800">
                ₹{item.price} total
              </p>
              <p className="text-sm text-gray-500">
                📅 {formatDate(item.pickupDate)} → {formatDate(item.returnDate)}
              </p>
            </div>
            <div className="flex flex-col justify-between items-start md:items-end">
              <p className="text-sm text-gray-500">
                Booking #{index + 1}
              </p>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium
                ${
                  item.status === 'confirmed'
                    ? 'bg-green-100 text-green-600'
                    : item.status === 'cancelled'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
      )}
    </div>
  )
}

export default MyBooking
