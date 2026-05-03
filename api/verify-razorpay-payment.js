import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function loadLocalApiEnv() {
  if (process.env.RAZORPAY_KEY_SECRET) return;

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

function safeCompare(value, expected) {
  const valueBuffer = Buffer.from(String(value || ""), "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

async function appendBookingToGoogleSheet(booking) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { skipped: true };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.ok === false) {
    throw new Error(result.error || "Google Sheets append failed.");
  }

  return { skipped: false };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  loadLocalApiEnv();

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return sendJson(res, 500, {
      error: "Razorpay secret is missing on the server.",
    });
  }

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    booking,
  } = req.body || {};

  if (!orderId || !paymentId || !signature) {
    return sendJson(res, 400, {
      error: "Payment confirmation details are missing.",
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!safeCompare(signature, expectedSignature)) {
    return sendJson(res, 400, {
      error: "Payment verification failed.",
    });
  }

  const confirmedBooking = {
    ...booking,
    paymentId,
    orderId,
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  };

  try {
    await appendBookingToGoogleSheet(confirmedBooking);
  } catch (error) {
    console.error("Google Sheets append error:", error);

    return sendJson(res, 500, {
      error:
        "Payment verified, but booking could not be saved to Google Sheets. Please contact the hotel with your payment ID.",
      paymentId,
      orderId,
    });
  }

  return sendJson(res, 200, {
    verified: true,
    booking: confirmedBooking,
  });
}
