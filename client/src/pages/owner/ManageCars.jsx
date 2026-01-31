import React, { useEffect, useState } from 'react';
import Title from '../../component/owner/Title';
import { Edit3, Trash2, Eye } from 'lucide-react';
import { ownerApi } from '../../api';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOwnerCars = async () => {
    setLoading(true);
    setError("");
    try {
      const { cars: list } = await ownerApi.getCars();
      setCars(list || []);
    } catch (err) {
      setError(err.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Remove this car from your listings?")) return;
    try {
      await ownerApi.deleteCar(carId);
      setCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (err) {
      setError(err.message || "Failed to delete");
    }
  };

  const handleToggle = async (carId) => {
    try {
      await ownerApi.toggleCar(carId);
      setCars((prev) =>
        prev.map((c) => (c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c))
      );
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <Title 
        title="Manage Cars" 
        subTitle="View all listed cars, update their details, or remove them from the booking platform." 
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {loading ? (
        <p className="mt-8 text-gray-500">Loading cars...</p>
      ) : (
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Car Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 max-md:hidden">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={car.image} 
                        alt={car.model} 
                        className="w-16 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm md:text-base">
                          {car.brand} <span className="text-blue-600">{car.model}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {(car.seatingCapacity ?? car.seating_capacity) ?? "-"} Seater • {car.transmission}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-md:hidden">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {car.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    ${car.pricePerDay}<span className="text-gray-400 font-normal">/day</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${car.isAvailable ? "text-green-600" : "text-gray-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${car.isAvailable ? "bg-green-500" : "bg-gray-400"}`}></span>
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View details">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleToggle(car._id)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title={car.isAvailable ? "Mark unavailable" : "Mark available"}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete car"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {cars.length} cars</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ManageCars;