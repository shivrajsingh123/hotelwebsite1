import { useEffect, useRef, useState } from "react";

const fallbackReviews = [
  {
    authorName: "Rahul Sharma",
    rating: 5,
    text: "Excellent rooms, neat and clean environment, and very polite staff.",
    time: "Guest review",
  },
  {
    authorName: "Priya Verma",
    rating: 5,
    text: "Very comfortable stay. The rooms were spacious and the service was great.",
    time: "Guest review",
  },
  {
    authorName: "Amit Kumar",
    rating: 4,
    text: "Good hotel with nice ambience and all basic amenities.",
    time: "Guest review",
  },
];

let googleMapsScriptPromise;

function loadGoogleMaps(apiKey) {
  if (window.google?.maps?.importLibrary) {
    return Promise.resolve(window.google);
  }

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places&loading=async`;
      script.async = true;
      script.onerror = () => reject(new Error("Google Maps failed to load"));
      script.onload = () => resolve(window.google);
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
}

function StarRating({ rating }) {
  return (
    <div className="flex justify-center gap-1 text-lg text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= Math.round(rating || 0) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function normalizeReview(review) {
  return {
    authorName: review.authorAttribution?.displayName || "Google user",
    authorUrl: review.authorAttribution?.uri || "",
    authorPhoto: review.authorAttribution?.photoURI || "",
    rating: review.rating || 0,
    text: review.text || review.originalText || "No written review provided.",
    time: review.relativePublishTimeDescription || "",
    googleMapsUrl: review.googleMapsURI || "",
  };
}

function GoogleReviews() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
  const reviewUrl =
    import.meta.env.VITE_GOOGLE_REVIEW_URL ||
    (placeId
      ? `https://search.google.com/local/writereview?placeid=${placeId}`
      : "");
  const sectionRef = useRef(null);
  const [reviews, setReviews] = useState(fallbackReviews);
  const [place, setPlace] = useState({
    name: "Hotel Ganesh International",
    rating: 4.8,
    userRatingCount: null,
    googleMapsUrl: "",
  });
  const [shouldFetchReviews, setShouldFetchReviews] = useState(false);
  const [status, setStatus] = useState(apiKey && placeId ? "idle" : "setup");

  useEffect(() => {
    if (!apiKey || !placeId || shouldFetchReviews) return;

    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      setShouldFetchReviews(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetchReviews(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [apiKey, placeId, shouldFetchReviews]);

  useEffect(() => {
    let isMounted = true;

    async function fetchGoogleReviews() {
      if (!apiKey || !placeId || !shouldFetchReviews) return;

      try {
        setStatus("loading");
        const google = await loadGoogleMaps(apiKey);
        const { Place } = await google.maps.importLibrary("places");
        const googlePlace = new Place({ id: placeId });

        await googlePlace.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "googleMapsURI",
            "rating",
            "userRatingCount",
            "reviews",
          ],
        });

        if (!isMounted) return;

        setPlace({
          name: googlePlace.displayName || "Hotel Ganesh International",
          rating: googlePlace.rating || 0,
          userRatingCount: googlePlace.userRatingCount || null,
          googleMapsUrl: googlePlace.googleMapsURI || "",
        });

        if (googlePlace.reviews?.length) {
          setReviews(googlePlace.reviews.slice(0, 5).map(normalizeReview));
        }

        setStatus("ready");
      } catch {
        if (isMounted) {
          setStatus("error");
        }
      }
    }

    fetchGoogleReviews();

    return () => {
      isMounted = false;
    };
  }, [apiKey, placeId, shouldFetchReviews]);

  return (
    <section ref={sectionRef} className="rounded-lg bg-white p-8 shadow-md">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          Google Reviews
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          What Guests Say About Us
        </h2>

        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-slate-600 sm:flex-row">
          <StarRating rating={place.rating} />
          <span className="font-semibold text-slate-900">
            {place.rating ? place.rating.toFixed(1) : "New"}
          </span>
          {place.userRatingCount && (
            <span>from {place.userRatingCount} Google reviews</span>
          )}
        </div>

        {(status === "idle" || status === "loading") && (
          <p className="mt-3 text-sm text-slate-500">
            {status === "loading"
              ? "Loading latest Google reviews..."
              : "Latest Google reviews will load when this section is in view."}
          </p>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-slate-500">
            Google reviews are temporarily unavailable.
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((review) => (
          <article
            key={`${review.authorName}-${review.time}`}
            className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {review.authorPhoto ? (
                <img
                  src={review.authorPhoto}
                  alt={review.authorName}
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {review.authorName.slice(0, 1)}
                </div>
              )}

              <div>
                {review.authorUrl ? (
                  <a
                    href={review.authorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {review.authorName}
                  </a>
                ) : (
                  <h3 className="font-semibold text-slate-900">
                    {review.authorName}
                  </h3>
                )}
                <p className="text-xs text-slate-500">{review.time}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-start">
              <StarRating rating={review.rating} />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              "{review.text}"
            </p>

            {review.googleMapsUrl && (
              <a
                href={review.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View on Google
              </a>
            )}
          </article>
        ))}
      </div>

      {(place.googleMapsUrl || reviewUrl) && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Write a Review
            </a>
          )}

          {place.googleMapsUrl && (
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            See all Google reviews
          </a>
          )}
        </div>
      )}
    </section>
  );
}

export default GoogleReviews;
