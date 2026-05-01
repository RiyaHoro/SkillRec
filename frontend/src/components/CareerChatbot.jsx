import { useState } from "react";

function CareerChatbot({ career, userProfile }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I am your SkillSakhi Career Assistant. Ask me about career path, skills, courses, or jobs.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          career_name: career?.career_name || "",
          user_profile: userProfile || {},
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply.includes("offline")
            ? "⚠️ " + data.reply
            : data.reply || "Sorry, I could not answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Chatbot is not connected. Make sure Flask backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 mt-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        SkillSakhi Career Chatbot
      </h2>

      <div className="h-80 overflow-y-auto bg-gray-100 rounded-2xl p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <p className="text-sm text-gray-500">Typing...</p>}
      </div>

      <div className="flex gap-3 mt-4">
        <input
          type="text"
          placeholder="Ask about skills, courses, roadmap..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CareerChatbot;
