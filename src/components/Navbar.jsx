function Navbar() {

  const whatsappLink =
    "https://wa.me/918292980491?text=Hello%20I%20would%20like%20to%20book%20a%20room%20at%20Hotel%20Ganesh%20International";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hotel Ganesh International
          </h1>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Comfort • Elegance • Hospitality
          </span>
        </div>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Rooms</li>
          <li className="cursor-pointer hover:text-blue-600">Amenities</li>
          <li className="cursor-pointer hover:text-blue-600">Gallery</li>
          <li className="cursor-pointer hover:text-blue-600">Contact</li>
        </ul>

        <div className="flex items-center gap-3">

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:block"
          >
            Call Now
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Book Now
          </a>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;