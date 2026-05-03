function FooterMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
  const hotelQuery =
    import.meta.env.VITE_GOOGLE_MAP_QUERY ||
    "Hotel Ganesh International, Barh, Patna, Bihar";

  const mapUrl =
    apiKey && placeId
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          hotelQuery,
        )}&output=embed`;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
      <iframe
        title="Hotel Ganesh International location map"
        src={mapUrl}
        width="100%"
        height="260"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block border-0"
      />
    </div>
  );
}

export default FooterMap;
