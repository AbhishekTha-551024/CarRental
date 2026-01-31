import React, { useEffect, useState } from 'react';
import Title from '../../component/owner/Title';
import { Calendar, CreditCard, ChevronDown } from 'lucide-react';
import { ownerApi, bookingApi } from '../../api';

const ManageBookings = () => {
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOwnerBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const { bookings } = await ownerApi.getBookings();
      setBooking(bookings || []);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
      setBooking([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await bookingApi.changeStatus(bookingId, status);
      setBooking((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOwnerBooking();
  }, []);

  // Helper for status badge styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses"
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {loading ? (
        <p className="mt-8 text-gray-500">Loading bookings...</p>
      ) : (
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Car Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 max-md:hidden">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Total Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Status/Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {booking.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={item.car?.image} 
                          alt="" 
                          className="w-16 h-12 object-cover rounded-lg shadow-sm border border-gray-100"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{item.car?.brand}</p>
                        <p className="text-sm text-blue-600 font-medium">{item.car?.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-md:hidden">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(item.pickupDate)}</span>
                        <span className="text-gray-300">→</span>
                        <span>{formatDate(item.returnDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">${item.price}</p>
                    <p className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">Total Gross</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 rounded-md">
                        <CreditCard size={14} className="text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 capitalize">Offline</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {item.status === 'pending' ? (
                        <div className="relative inline-block w-full max-w-[140px]">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                            className="block w-full appearance-none bg-amber-50 border border-amber-200 text-amber-800 py-1.5 px-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-600">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wide ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">
            Total Bookings: <span className="text-gray-900">{booking.length}</span>
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all active:scale-95">Next</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ManageBookings;