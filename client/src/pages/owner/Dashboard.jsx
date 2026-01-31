import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../component/owner/Title'
import { ownerApi } from '../../api'

const Dashboard = () => {
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored }
  ]

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await ownerApi.getDashboard()
        if (cancelled) return
        const { stats = {}, recentBookings = [] } = res
        setData({
          totalCars: stats.totalCars ?? 0,
          totalBookings: stats.totalBookings ?? 0,
          pendingBookings: stats.pendingBookings ?? 0,
          completedBookings: stats.activeBookings ?? 0,
          recentBookings: Array.isArray(recentBookings) ? recentBookings : [],
          monthlyRevenue: stats.totalEarnings ?? 0
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {loading && <p className="text-sm text-gray-500 mb-2">Loading dashboard...</p>}
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* ===== Dashboard Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </div>

            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
              <img src={card.icon} alt="" className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Bottom Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

        {/* ===== Recent Bookings ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Latest customer bookings
          </p>

          <div className="space-y-4">
            {data.recentBookings.map((booking, index) => (
              <div
                key={booking._id || index}
                className="flex items-center justify-between border-b last:border-none pb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {booking.car?.image ? (
                      <img src={booking.car.image} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                      <img src={assets.listIconColored} alt="" className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {booking.car?.brand ?? 'Car'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : ''}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ${booking.price}
                  </p>
                  <p className="text-sm text-green-600 capitalize">
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Monthly Revenue ===== */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Monthly Revenue
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Revenue generated this month
          </p>

          <p className="text-3xl font-bold text-indigo-600">
            ${data.monthlyRevenue}
          </p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
