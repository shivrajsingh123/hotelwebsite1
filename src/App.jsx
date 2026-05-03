import { Route, Routes, useNavigate } from "react-router-dom";
import hotel1 from "./assets/hotel1.jpg";
import hotel2 from "./assets/hotel2.jpg";
import hotel3 from "./assets/hotel3.jpg";
import hotel4 from "./assets/hotel4.jpg";
import hotel5 from "./assets/hotel5.jpg";
import hotel6 from "./assets/hotel6.jpg";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatBot from "./components/ChatBot";
import BookingForm from "./components/BookingForm";
import FooterMap from "./components/FooterMap";
import GoogleReviews from "./components/GoogleReviews";
import BookingPage from "./pages/BookingPage";
import { rooms } from "./data/rooms";
import "./App.css";

const amenities = [
  {
    title: "Free Wi-Fi",
    text: "High-speed internet available throughout the hotel.",
    icon: "wifi",
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Free Breakfast",
    text: "Enjoy a complimentary breakfast every morning.",
    icon: "breakfast",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    title: "Refrigerator",
    text: "Every room comes with a personal refrigerator.",
    icon: "fridge",
    tone: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Toiletries",
    text: "Complimentary toiletries for your convenience.",
    icon: "toiletries",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Air-Conditioned Rooms",
    text: "Stay comfortable with fully air-conditioned rooms.",
    icon: "ac",
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Parking",
    text: "Safe and convenient parking available for guests.",
    icon: "parking",
    tone: "bg-slate-200 text-slate-700",
  },
  {
    title: "24/7 Reception",
    text: "Our front desk is available anytime to assist you.",
    icon: "reception",
    tone: "bg-rose-100 text-rose-700",
  },
  {
    title: "Room Service",
    text: "Convenient room service available during your stay.",
    icon: "service",
    tone: "bg-lime-100 text-lime-700",
  },
];

function AmenityIcon({ type }) {
  const commonProps = {
    className: "h-7 w-7",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  const icons = {
    wifi: (
      <svg {...commonProps}>
        <path d="M5 12.5a10 10 0 0 1 14 0" />
        <path d="M8.5 16a5 5 0 0 1 7 0" />
        <path d="M12 19h.01" />
      </svg>
    ),
    breakfast: (
      <svg {...commonProps}>
        <path d="M6 8h10v5a5 5 0 0 1-10 0Z" />
        <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
        <path d="M5 20h14" />
        <path d="M8 4v1" />
        <path d="M12 4v1" />
      </svg>
    ),
    fridge: (
      <svg {...commonProps}>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M7 10h10" />
        <path d="M10 7h.01" />
        <path d="M10 14h.01" />
      </svg>
    ),
    toiletries: (
      <svg {...commonProps}>
        <path d="M9 6h6" />
        <path d="M10 6V4h4v2" />
        <rect x="7" y="8" width="10" height="13" rx="2" />
        <path d="M10 12h4" />
        <path d="M10 15h4" />
      </svg>
    ),
    ac: (
      <svg {...commonProps}>
        <path d="M12 3v18" />
        <path d="m8 7 4-4 4 4" />
        <path d="m8 17 4 4 4-4" />
        <path d="M3 12h18" />
        <path d="m7 8-4 4 4 4" />
        <path d="m17 8 4 4-4 4" />
      </svg>
    ),
    parking: (
      <svg {...commonProps}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
    reception: (
      <svg {...commonProps}>
        <path d="M4 19h16" />
        <path d="M6 19v-3a6 6 0 0 1 12 0v3" />
        <path d="M12 5v3" />
        <path d="M9 8h6" />
      </svg>
    ),
    service: (
      <svg {...commonProps}>
        <path d="M4 18h16" />
        <path d="M6 18a6 6 0 0 1 12 0" />
        <path d="M12 7v3" />
        <path d="M10 7h4" />
        <path d="M5 21h14" />
      </svg>
    ),
  };

  return icons[type] || icons.service;
}

function HomePage() {
  const navigate = useNavigate();

  const handleBookRoom = (roomId) => {
    navigate(`/booking?room=${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar />
      <Hero />
      <BookingForm />

      <main className="mx-auto mt-10 max-w-7xl space-y-10 px-6">
        <section id="rooms" className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="mb-8 text-center text-3xl font-bold text-slate-900">
            Our Rooms
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"
              >
                <img
                  src={room.image}
                  alt={room.name}
                  loading="lazy"
                  decoding="async"
                  className="h-52 w-full object-cover"
                />

                <div className="p-4">
                  <h4 className="text-xl font-semibold text-slate-900">
                    {room.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {room.description}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Up to {room.maxGuests} guests | {room.availableRooms} rooms left
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {room.price} / night
                    </span>

                    <button
                      type="button"
                      onClick={() => handleBookRoom(room.id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="amenities" className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="text-center text-3xl font-bold text-slate-900">
            Hotel Amenities
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            We provide everything you need for a comfortable and relaxing stay.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.title}
                className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${amenity.tone}`}
                >
                  <AmenityIcon type={amenity.icon} />
                </div>
                <h4 className="mt-4 text-xl font-semibold">{amenity.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{amenity.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="text-center text-3xl font-bold text-slate-900">
            Our Gallery
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Take a look at our rooms, interiors, and welcoming spaces designed
            to make your stay comfortable and memorable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="md:col-span-2 md:row-span-2">
              <img
                src={hotel1}
                alt="Hotel main view"
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            {[hotel2, hotel3, hotel4, hotel5, hotel6].map((image, index) => (
              <div key={image}>
                <img
                  src={image}
                  alt={`Hotel gallery ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <GoogleReviews />
      </main>

      <ChatBot />

      <footer id="contact" className="mt-6 bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">
              Hotel Ganesh International
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
              Comfortable stay with modern amenities, free WiFi, breakfast, and
              excellent hospitality.
            </p>

            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <p>Booking: +91 82929 80491</p>
              <p>Payments: UPI, cards, net banking, and wallets via Razorpay</p>
              <p>Location: Find us on Google Maps</p>
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Copyright {new Date().getFullYear()} Hotel Ganesh International.
              All rights reserved.
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Site developed by{" "}
              <span className="font-semibold text-gray-300">Shiv Singh</span>
            </p>
          </div>

          <FooterMap />
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  );
}

export default App;
