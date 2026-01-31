import React, { useState } from "react";
import Title from "../../component/owner/Title";
import { Camera, CheckCircle2 } from "lucide-react";
import { ownerApi } from "../../api";

const AddCar = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const requiredFields = [
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "year", label: "Year" },
    { key: "category", label: "Category" },
    { key: "transmission", label: "Transmission" },
    { key: "fuel_type", label: "Fuel type" },
    { key: "seating_capacity", label: "Seating capacity" },
    { key: "location", label: "Location" },
    { key: "description", label: "Description" },
    { key: "pricePerDay", label: "Daily price" },
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!image) {
      setError("Please upload a car image.");
      return;
    }
    const missing = requiredFields.filter(({ key }) => {
      const v = car[key];
      return v === "" || v === undefined || v === null || (typeof v === "number" && isNaN(v));
    });
    if (missing.length) {
      setError("Please fill: " + missing.map((f) => f.label).join(", ") + ".");
      return;
    }
    const yearNum = Number(car.year);
    const seatNum = Number(car.seating_capacity);
    const priceNum = Number(car.pricePerDay);
    if (!yearNum || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      setError("Please enter a valid year (1990–" + (new Date().getFullYear() + 1) + ").");
      return;
    }
    if (!seatNum || seatNum < 1 || seatNum > 20) {
      setError("Please enter seating capacity between 1 and 20.");
      return;
    }
    if (!priceNum || priceNum <= 0) {
      setError("Please enter a valid daily price.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const carData = {
        brand: car.brand.trim(),
        model: car.model.trim(),
        year: yearNum,
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuel_type,
        seatingCapacity: seatNum,
        location: car.location,
        description: car.description.trim(),
        pricePerDay: priceNum,
      };
      formData.append("carData", JSON.stringify(carData));
      await ownerApi.addCar(formData);
      setCar({
        brand: "",
        model: "",
        year: "",
        pricePerDay: "",
        category: "",
        transmission: "",
        fuel_type: "",
        seating_capacity: "",
        location: "",
        description: "",
      });
      setImage(null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Tailwind classes for cleaner code
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputStyle = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all duration-200 placeholder:text-gray-400";

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Title
          title="Add New Car"
          subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
        />

        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8"
        >
          {/* Image Upload Section */}
          <div className="mb-8">
            <label className={labelStyle}>Car Photo</label>
            <div className="flex items-center gap-6">
              <label className="group relative flex flex-col items-center justify-center w-44 h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer overflow-hidden">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500">
                    <Camera className="w-8 h-8 mb-1" />
                    <span className="text-xs font-medium">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <div className="text-sm text-gray-500">
                <p className="font-medium text-gray-700">Upload a high-quality image</p>
                <p>PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {/* Brand */}
            <div>
              <label className={labelStyle}>Brand</label>
              <input
                type="text"
                placeholder="e.g. BMW"
                className={inputStyle}
                value={car.brand}
                onChange={(e) => setCar({ ...car, brand: e.target.value })}
              />
            </div>

            {/* Model */}
            <div>
              <label className={labelStyle}>Model</label>
              <input
                type="text"
                placeholder="e.g. X5"
                className={inputStyle}
                value={car.model}
                onChange={(e) => setCar({ ...car, model: e.target.value })}
              />
            </div>

            {/* Year */}
            <div>
              <label className={labelStyle}>Year</label>
              <input
                type="number"
                placeholder="2024"
                className={inputStyle}
                value={car.year}
                onChange={(e) => setCar({ ...car, year: e.target.value })}
              />
            </div>

            {/* Price */}
            <div>
              <label className={labelStyle}>Daily Price ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className={`${inputStyle} pl-8`}
                  value={car.pricePerDay}
                  onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={labelStyle}>Category</label>
              <select
                className={inputStyle}
                value={car.category}
                onChange={(e) => setCar({ ...car, category: e.target.value })}
              >
                <option value="">Select</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Luxury</option>
              </select>
            </div>

            {/* Seating */}
            <div>
              <label className={labelStyle}>Seating Capacity</label>
              <input
                type="number"
                placeholder="5"
                className={inputStyle}
                value={car.seating_capacity}
                onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
              />
            </div>

            {/* Transmission */}
            <div>
              <label className={labelStyle}>Transmission</label>
              <select
                className={inputStyle}
                value={car.transmission}
                onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className={labelStyle}>Fuel Type</label>
              <select
                className={inputStyle}
                value={car.fuel_type}
                onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className={labelStyle}>Location</label>
              <select
                className={inputStyle}
                value={car.location}
                onChange={(e) => setCar({ ...car, location: e.target.value })}
              >
                <option value="">Select City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className={labelStyle}>Description</label>
            <textarea
              rows="4"
              placeholder="Tell potential renters what makes your car special..."
              className={`${inputStyle} resize-none`}
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? "Adding..." : "List Your Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;