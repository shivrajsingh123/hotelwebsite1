import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookingForm() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    const query = params.toString();
    navigate(query ? `/booking?${query}` : "/booking");
  };

  return (
    <section className="mx-auto -mt-12 max-w-5xl px-6">
      <div className="relative z-20 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
          Check Room Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-3 h-[50px] transition"
          >
            Search Rooms
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default BookingForm;
