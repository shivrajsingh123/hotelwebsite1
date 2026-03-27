import React, { useState } from "react";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Welcome to Hotel Ganesh International. How can I help you today?"
    }
  ]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I could not process that."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please contact us on WhatsApp."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (text) => {
    setInput(text);
    setTimeout(() => {
      document.getElementById("chat-send-btn")?.click();
    }, 0);
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "×" : "Chat"}
      </button>

      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <div>
              <h3>Hotel Assistant</h3>
              <p>Ganesh International</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => handleQuickAction("What are your room prices?")}>
              Room Price
            </button>
            <button onClick={() => handleQuickAction("What amenities do you offer?")}>
              Amenities
            </button>
            <button onClick={() => handleQuickAction("How can I book a room?")}>
              Booking
            </button>
            <button onClick={() => handleQuickAction("Where is the hotel located?")}>
              Location
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="chat-message bot">Typing...</div>}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button id="chat-send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>

          <a
            className="whatsapp-link"
            href="https://wa.me/918292980491"
            target="_blank"
            rel="noreferrer"
          >
            Contact on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}