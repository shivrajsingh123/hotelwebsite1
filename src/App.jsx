import { useEffect, useState } from "react";
import hotel1 from "./assets/hotel1.png";
import hotel2 from "./assets/hotel2.png";
import hotel3 from "./assets/hotel3.png";
import hotel4 from "./assets/hotel4.png";
import hotel5 from "./assets/hotel5.png"; 
import hotel6 from "./assets/hotel6.png";
import Navbar from "./components/Navbar"; 
import Hero from "./components/Hero";







import './App.css'

function App() {


  const reviews = [
    {
      name: "Rahul Sharma",
      rating: "★★★★★",
      text: "Excellent rooms, neat and clean environment, and very polite staff."
    },
    {
      name: "Priya Verma",
      rating: "★★★★★",
      text: "Very comfortable stay. The rooms were spacious and the service was great."
    },
    {
      name: "Amit Kumar",
      rating: "★★★★☆",
      text: "Good hotel with nice ambience and all basic amenities."
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (


    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar />
     <Hero />

      <main className="mx-auto mt-10 max-w-7xl space-y-10 px-6">

         
        

        

        <section id="rooms" className="rounded-2xl bg-white p-8 shadow-md">
  <h3 className="mb-8 text-center text-3xl font-bold text-slate-900">
    Our Rooms
  </h3>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <img
                src={hotel2}
                alt="Single Room"
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h4 className="text-xl font-semibold text-slate-900">
                  Single Room
                </h4>

                <p className="mt-2 text-sm text-slate-600">
                  Comfortable room with modern amenities and a relaxing
                  atmosphere.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₹1200 / night
                  </span>

                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Book
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <img
                src={hotel1}
                alt="Executive Room"
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h4 className="text-xl font-semibold text-slate-900">
                  Executive Room
                </h4>

                <p className="mt-2 text-sm text-slate-600">
                  Spacious room designed for business travelers and families.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₹2000 / night
                  </span>

                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Book
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <img
                src={hotel3}
                alt="Luxury Suite"
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h4 className="text-xl font-semibold text-slate-900">
                  Luxury Suite
                </h4>

                <p className="mt-2 text-sm text-slate-600">
                  Premium suite offering elegance, comfort, and extra space.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₹2600 / night
                  </span>

                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-md">
  <h3 className="text-center text-3xl font-bold text-slate-900">
    Hotel Amenities
  </h3>

  <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
    We provide everything you need for a comfortable and relaxing stay.
  </p>

  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">📶</div>
      <h4 className="mt-4 text-xl font-semibold">Free Wi-Fi</h4>
      <p className="mt-2 text-sm text-slate-600">
        High-speed internet available throughout the hotel.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🍳</div>
      <h4 className="mt-4 text-xl font-semibold">Free Breakfast</h4>
      <p className="mt-2 text-sm text-slate-600">
        Enjoy a complimentary breakfast every morning.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🧊</div>
      <h4 className="mt-4 text-xl font-semibold">Refrigerator</h4>
      <p className="mt-2 text-sm text-slate-600">
        Every room comes with a personal refrigerator.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🧴</div>
      <h4 className="mt-4 text-xl font-semibold">Toiletries</h4>
      <p className="mt-2 text-sm text-slate-600">
        Complimentary toiletries for your convenience.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">❄️</div>
      <h4 className="mt-4 text-xl font-semibold">Air-Conditioned Rooms</h4>
      <p className="mt-2 text-sm text-slate-600">
        Stay comfortable with fully air-conditioned rooms.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🚗</div>
      <h4 className="mt-4 text-xl font-semibold">Parking</h4>
      <p className="mt-2 text-sm text-slate-600">
        Safe and convenient parking available for guests.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🛎️</div>
      <h4 className="mt-4 text-xl font-semibold">24/7 Reception</h4>
      <p className="mt-2 text-sm text-slate-600">
        Our front desk is available anytime to assist you.
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
      <div className="text-4xl">🍽️</div>
      <h4 className="mt-4 text-xl font-semibold">Room Service</h4>
      <p className="mt-2 text-sm text-slate-600">
        Convenient room service available during your stay.
      </p>
    </div>
  </div>
</section>

        <section className="rounded-2xl bg-white p-8 shadow-md">
  <h3 className="text-center text-3xl font-bold text-slate-900">
    Our Gallery
  </h3>

  <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
    Take a look at our rooms, interiors, and welcoming spaces designed to make
    your stay comfortable and memorable.
  </p>

  <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
    <div className="md:col-span-2 md:row-span-2">
      <img
        src={hotel1}
        alt="Hotel main view"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

    <div>
      <img
        src={hotel2}
        alt="Hotel room"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

    <div>
      <img
        src={hotel3}
        alt="Hotel interior"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

    <div>
      <img
        src={hotel4}
        alt="Hotel amenities"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

    <div>
      <img
        src={hotel5}
        alt="Hotel stay"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

  <div>
      <img
        src={hotel6}
        alt="Hotel stay"
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>

  </div>
</section>
<section className="rounded-xl bg-white p-10 text-center shadow-md">
  <h2 className="mb-6 text-3xl font-bold text-slate-800">Guest Reviews</h2>

  <div className="mx-auto max-w-3xl rounded-2xl bg-slate-50 p-8 transition-all duration-500">
    <p className="mb-4 text-lg leading-8 text-slate-600">
      "{reviews[currentReview].text}"
    </p>

    <h3 className="text-xl font-semibold text-slate-800">
      {reviews[currentReview].name}
    </h3>

    <p className="mt-2 text-yellow-500 text-lg">
      {reviews[currentReview].rating}
    </p>
  </div>

  <div className="mt-6 flex justify-center gap-2">
    {reviews.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentReview(index)}
        className={`h-3 w-3 rounded-full ${
          currentReview === index ? "bg-slate-800" : "bg-slate-300"
        }`}
      ></button>
    ))}
  </div>

</section>

      </main>
<footer className="mt-6 bg-slate-900 text-white">
  <div className="max-w-7xl mx-auto px-6 py-8 text-center">

    <h2 className="text-lg font-semibold mb-2">
      Hotel Ganesh International
    </h2>

    <p className="text-sm text-gray-300 mb-3">
      Comfortable stay with modern amenities, free WiFi, breakfast, and excellent hospitality.
    </p>

    <p className="text-sm text-gray-400">
      © {new Date().getFullYear()} Hotel Ganesh International. All rights reserved.
    </p>

    <p className="text-xs text-gray-500 mt-2">
      Site developed by <span className="font-semibold text-gray-300">Shiv Singh</span>
    </p>

  </div>
</footer>
    </div>
  );
}

export default App;