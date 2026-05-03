import fs from "node:fs";
import path from "node:path";

const rooms = {
  "single-room": {
    name: "Single Room",
    price: 1200,
    maxGuests: 2,
    availableRooms: 8,
  },
  "executive-room": {
    name: "Executive Room",
    price: 2000,
    maxGuests: 4,
    availableRooms: 5,
  },
  "luxury-suite": {
    name: "Luxury Suite",
    price: 2600,
    maxGuests: 5,
    availableRooms: 3,
  },
};

function loadLocalApiEnv() {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) return;

  const envPath = path.join(process.cwd(), "api", ".env");

  if (!fs.existsSync(envPath)) return;

  const envText = fs.readFileSync(envPath, "utf8");

  envText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

function sendJson(res, statusCode, body) {
  res.status(statusCode).json(body);
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const difference = end.getTime() - start.getTime();

  if (Number.isNaN(difference) || difference <= 0) return 0;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function createBookingSummary(body) {
  const room = rooms[body?.roomId];
  const guests = Math.max(Number(body?.guests) || 1, 1);
  const roomCount = Math.max(Number(body?.roomCount) || 1, 1);
  const nights = calculateNights(body?.checkIn, body?.checkOut);
  const fullName = String(body?.fullName || "").trim();
  const email = String(body?.email || "").trim();
  const phone = String(body?.phone || "").trim();

  if (!room) {
    return { error: "Please select a valid room." };
  }

  if (!fullName) {
    return { error: "Please enter the guest name." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { error: "Please enter a valid 10 digit Indian mobile number." };
  }

  if (nights <= 0) {
    return { error: "Check-out date must be after check-in date." };
  }

  if (roomCount > room.availableRooms) {
    return { error: `Only ${room.availableRooms} rooms are available.` };
  }

  if (guests > room.maxGuests * roomCount) {
    return {
      error: `${room.name} allows up to ${room.maxGuests * roomCount} guests for ${roomCount} room(s).`,
    };
  }

  const subtotal = nights * roomCount * room.price;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst;

  return {
    fullName,
    email,
    phone,
    roomId: body.roomId,
    roomName: room.name,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests,
    roomCount,
    nights,
    subtotal,
    gst,
    total,
    amount: total * 100,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  loadLocalApiEnv();

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return sendJson(res, 500, {
      error: "Razorpay API keys are missing on the server.",
    });
  }

  const booking = createBookingSummary(req.body);

  if (booking.error) {
    return sendJson(res, 400, { error: booking.error });
  }

  const receipt = `HGI-${Date.now()}`;
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: booking.amount,
        currency: "INR",
        receipt,
        notes: {
          guestName: booking.fullName,
          email: booking.email,
          phone: booking.phone,
          roomType: booking.roomName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: String(booking.guests),
          rooms: String(booking.roomCount),
        },
      }),
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return sendJson(res, razorpayResponse.status, {
        error: order.error?.description || "Unable to create Razorpay order.",
      });
    }

    return sendJson(res, 200, {
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
      booking,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);

    return sendJson(res, 500, {
      error: "Unable to connect to Razorpay.",
    });
  }
}
