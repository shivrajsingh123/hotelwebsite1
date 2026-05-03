import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getRoomById, rooms } from "../data/rooms";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const difference = end.getTime() - start.getTime();

  if (Number.isNaN(difference) || difference <= 0) return 0;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function formatAmount(amount) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

function createBookingPayload(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    roomId: form.roomId,
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    guests: form.guests,
    roomCount: form.roomCount,
  };
}

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function BookingPage() {
  const [searchParams] = useSearchParams();
  const initialRoom = getRoomById(searchParams.get("room"));
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomId: initialRoom.id,
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "1",
    roomCount: "1",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const preloadRazorpay = () => {
      loadRazorpayScript().catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadRazorpay, {
        timeout: 2500,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preloadRazorpay, 1000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const selectedRoom = getRoomById(form.roomId);
  const guests = Math.max(Number(form.guests) || 1, 1);
  const roomCount = Math.max(Number(form.roomCount) || 1, 1);
  const nights = calculateNights(form.checkIn, form.checkOut);

  const charges = useMemo(() => {
    const subtotal = nights * roomCount * selectedRoom.price;
    const gst = Math.round(subtotal * 0.12);
    const total = subtotal + gst;

    return { subtotal, gst, total };
  }, [nights, roomCount, selectedRoom.price]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setPaymentMessage(null);
    setLatestBooking(null);
  };

  const validateForm = () => {
    const errors = {};
    const trimmedPhone = form.phone.trim();

    if (!form.fullName.trim()) {
      errors.fullName = "Please enter the guest name.";
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      errors.phone = "Please enter a valid 10 digit Indian mobile number.";
    }

    if (!form.checkIn) {
      errors.checkIn = "Please select a check-in date.";
    }

    if (!form.checkOut) {
      errors.checkOut = "Please select a check-out date.";
    }

    if (form.checkIn && form.checkOut && nights === 0) {
      errors.checkOut = "Check-out date must be after check-in date.";
    }

    if (roomCount > selectedRoom.availableRooms) {
      errors.roomCount = `Only ${selectedRoom.availableRooms} rooms are available.`;
    }

    if (guests > selectedRoom.maxGuests * roomCount) {
      errors.guests = `${selectedRoom.name} allows up to ${
        selectedRoom.maxGuests * roomCount
      } guests for ${roomCount} room(s).`;
    }

    if (charges.total <= 0) {
      errors.total = "Please complete the stay details to calculate charges.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setPaymentMessage({
        type: "error",
        text: "Please fix the highlighted details before payment.",
      });
      return;
    }

    setIsPaying(true);

    let scriptLoaded = false;
    let orderResponse = null;

    try {
      const bookingPayload = createBookingPayload(form);

      [scriptLoaded, orderResponse] = await Promise.all([
        loadRazorpayScript(),
        fetch("/api/create-razorpay-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }),
      ]);
    } catch {
      setIsPaying(false);
      setPaymentMessage({
        type: "error",
        text: "Unable to reach the payment server. Please restart the dev server and try again.",
      });
      return;
    }

    if (!scriptLoaded) {
      setIsPaying(false);
      setPaymentMessage({
        type: "error",
        text: "Unable to load Razorpay checkout. Please check your internet connection.",
      });
      return;
    }

    const order = await orderResponse.json().catch(() => ({
      error: "Payment server returned an invalid response.",
    }));

    if (!orderResponse.ok) {
      setIsPaying(false);
      setPaymentMessage({
        type: "error",
        text: order.error || "Unable to create Razorpay order.",
      });
      return;
    }

    setIsPaying(false);

    const bookingReference = order.receipt;
    const confirmedBooking = order.booking;

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Hotel Ganesh International",
      description: `${selectedRoom.name} booking`,
      image: selectedRoom.image,
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        bookingReference,
        roomType: selectedRoom.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: String(guests),
        rooms: String(roomCount),
      },
      theme: {
        color: "#2563eb",
      },
      handler(response) {
        setIsPaying(true);
        setPaymentMessage({
          type: "info",
          text: "Payment received. Verifying confirmation...",
        });

        fetch("/api/verify-razorpay-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            booking: {
              ...confirmedBooking,
              bookingReference,
              amountPaid: confirmedBooking.total,
            },
          }),
        })
          .then((verifyResponse) =>
            verifyResponse.json().then((body) => ({
              ok: verifyResponse.ok,
              body,
            })),
          )
          .then(({ ok, body }) => {
            setIsPaying(false);

            if (!ok) {
              setPaymentMessage({
                type: "error",
                text: body.error || "Payment verification failed.",
              });
              return;
            }

            const booking = {
              ...body.booking,
              guestName: body.booking.fullName,
              rooms: body.booking.roomCount,
            };

            localStorage.setItem("latestHotelBooking", JSON.stringify(booking));
            setLatestBooking(booking);

            setPaymentMessage({
              type: "success",
              text: `Payment verified. Booking reference: ${bookingReference}`,
            });
          })
          .catch(() => {
            setIsPaying(false);
            setPaymentMessage({
              type: "error",
              text: "Payment was received, but confirmation could not be verified. Please contact the hotel with your payment ID.",
            });
          });
      },
      modal: {
        ondismiss() {
          setPaymentMessage({
            type: "info",
            text: "Payment window closed. Your booking is not confirmed yet.",
          });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Room Booking
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Complete Your Stay Details
              </h1>
            </div>

            <Link
              to="/#rooms"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Rooms
            </Link>
          </div>

          <form className="grid gap-5" onSubmit={handlePayment}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Guest Name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateForm}
                  placeholder="Enter full name"
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.fullName && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.fullName}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Mobile Number
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="10 digit mobile number"
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.phone && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.phone}
                  </span>
                )}
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateForm}
                placeholder="guest@example.com"
                className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-600">{fieldErrors.email}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Room Type
              <select
                name="roomId"
                value={form.roomId}
                onChange={updateForm}
                className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {formatAmount(room.price)} per night
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Check In
                <input
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  min={getToday()}
                  onChange={updateForm}
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.checkIn && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.checkIn}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Check Out
                <input
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  min={form.checkIn || getToday()}
                  onChange={updateForm}
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.checkOut && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.checkOut}
                  </span>
                )}
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Number of Rooms
                <input
                  type="number"
                  name="roomCount"
                  min="1"
                  max={selectedRoom.availableRooms}
                  value={form.roomCount}
                  onChange={updateForm}
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.roomCount && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.roomCount}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Guests
                <input
                  type="number"
                  name="guests"
                  min="1"
                  value={form.guests}
                  onChange={updateForm}
                  className="rounded-md border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.guests && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.guests}
                  </span>
                )}
              </label>
            </div>

            {fieldErrors.total && (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {fieldErrors.total}
              </p>
            )}

            {paymentMessage && (
              <p
                className={`rounded-md px-4 py-3 text-sm font-medium ${
                  paymentMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : paymentMessage.type === "info"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-red-700"
                }`}
              >
                {paymentMessage.text}
              </p>
            )}

            {latestBooking && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-semibold">Booking confirmed</p>
                <p className="mt-1">
                  Payment ID:{" "}
                  <span className="font-medium">{latestBooking.paymentId}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPaying || Boolean(latestBooking)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {latestBooking
                ? "Booking Confirmed"
                : isPaying
                  ? "Opening Razorpay..."
                  : `Pay ${formatAmount(charges.total)}`}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-lg bg-white p-6 shadow-md">
            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
              loading="lazy"
              decoding="async"
              className="h-56 w-full rounded-lg object-cover"
            />

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            {selectedRoom.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {selectedRoom.description}
          </p>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Room price</span>
              <strong>{formatAmount(selectedRoom.price)} / night</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Nights</span>
              <strong>{nights}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Rooms</span>
              <strong>{roomCount}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Subtotal</span>
              <strong>{formatAmount(charges.subtotal)}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">GST 12%</span>
              <strong>{formatAmount(charges.gst)}</strong>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5 text-lg">
            <span className="font-bold text-slate-900">Total Charges</span>
            <strong className="text-blue-600">{formatAmount(charges.total)}</strong>
          </div>

          <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Payment gateway: Razorpay India. Supports UPI, cards, net banking,
            and wallets after your Razorpay key is configured.
          </p>
        </aside>
      </main>
    </div>
  );
}

export default BookingPage;
