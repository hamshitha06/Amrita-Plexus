"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCarpool } from "@/context/CarpoolContext";
import Link from "next/link";

export default function OfferRide() {
  const router = useRouter();
  const { addRide, currentUser } = useCarpool();

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    seats: 3,
    price: 100,
    rideType: "Own Car",
  });

  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(new Date().toISOString().split("T")[0]);
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const result = await addRide(formData);
    setSubmitting(false);

    if (result.success) {
      alert("Your carpool ride has been published successfully!");
      router.push("/carpool/my-rides");
    } else {
      setErrorMsg(result.error || "Failed to publish ride.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "seats" || name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/carpool" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
            &larr; Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Offer a Campus Ride</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Driver Details</h3>
            <p className="text-xs text-gray-500">Offering ride as: <strong className="text-blue-700">{currentUser?.name || "Student"}</strong></p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-bold">
            Verified Student
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Origin / Pickup Location *</label>
              <input
                type="text"
                name="source"
                required
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g. Main Gate, Campus Hostel 2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Destination *</label>
              <input
                type="text"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Coimbatore Junction, Airport"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Departure Date *</label>
              <input
                type="date"
                name="date"
                required
                min={todayDate}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Departure Time *</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Seats *</label>
              <select
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Seat{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price per Seat (₹) *</label>
              <input
                type="number"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ride Mode / Vehicle *</label>
              <select
                name="rideType"
                value={formData.rideType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Own Car">Own Car</option>
                <option value="Taxi">Taxi (Shared)</option>
                <option value="Auto">Auto Rickshaw</option>
                <option value="Bike">Bike / Scooter</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md text-sm"
            >
              {submitting ? "Publishing Ride..." : "Publish Carpool Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
