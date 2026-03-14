import hotel1 from "../assets/hotel1.png";

function Hero() {
  const whatsappLink =
    "https://wa.me/918292980491?text=Hello%20I%20would%20like%20to%20book%20a%20room%20at%20Hotel%20Ganesh%20International";

  const handleExploreRooms = () => {
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-xl">
      <div className="relative h-[75vh] min-h-[500px] w-full">
        <img
          src={hotel1}
          alt="Hotel Ganesh International"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
              Welcome to Hotel Ganesh International
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Experience Comfort, Elegance
              <span className="block text-blue-300">
                and Warm Hospitality
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Discover a relaxing stay with beautifully designed rooms,
              modern amenities, and a peaceful atmosphere for families,
              travelers, and business guests.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white transition hover:scale-105 hover:bg-blue-700"
              >
                Book Your Stay
              </a>

              <button
                onClick={handleExploreRooms}
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20"
              >
                Explore Rooms
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-200">
              <span>✔ Free Wi-Fi</span>
              <span>✔ Free Breakfast</span>
              <span>✔ AC Rooms</span>
              <span>✔ 24/7 Reception</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;