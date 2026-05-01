function BookingForm() {
  return (
    <section className="bg-white shadow-xl rounded-xl p-6 max-w-5xl mx-auto transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:ring-2 hover:ring-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-5xl mx-auto">
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
              className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">
              Check Out
            </label>
            <input
              type="date"
              className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-2">
              Guests
            </label>
            <select className="border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5+ Guests</option>
            </select>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-3 h-[50px] transition">
            Search Rooms
          </button>
        </div>
      </div>
    </section>
  );
}

export default BookingForm;