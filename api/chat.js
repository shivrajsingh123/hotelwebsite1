export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const text = message.toLowerCase();

    let reply = "";

    // 🔹 Intent-based responses
    if (text.includes("price") || text.includes("room") || text.includes("cost")) {
      reply =
        "Our rooms start from ₹1500 per night. AC rooms with Wi-Fi and complimentary breakfast are included.";
    } 
    else if (text.includes("amenities") || text.includes("facilities")) {
      reply =
        "We offer free Wi-Fi, AC rooms, 24/7 reception, room service, and complimentary breakfast.";
    } 
    else if (text.includes("location") || text.includes("where")) {
      reply =
        "We are centrally located with easy access to markets, transport, and tourist attractions.";
    } 
    else if (text.includes("booking") || text.includes("book")) {
      reply =
        "You can book directly through our website or contact us on WhatsApp for quick booking assistance.";
    } 
    else if (text.includes("contact") || text.includes("phone") || text.includes("number")) {
      reply =
        "You can contact us using the 'Call Now' button or via WhatsApp for instant support.";
    } 
    else if (text.includes("check-in") || text.includes("checkin")) {
      reply = "Check-in time is 12:00 PM and check-out time is 11:00 AM.";
    } 
    else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      reply =
        "Hello! Welcome to Hotel Ganesh International. How can I assist you today?";
    } 
    else {
      reply =
        "I can help you with room prices, amenities, booking, location, and check-in details. What would you like to know?";
    }

    // 🔹 Add slight delay (feels like real AI)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      reply: "Something went wrong. Please contact us on WhatsApp.",
    });
  }
}