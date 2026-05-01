import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

function CareerChatbot({ career, userProfile }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me about this career, roadmap, or skills.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message;

    setChat((prev) => [...prev, { sender: "user", text: userText }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          career_name: career?.career_name,
          user_profile: userProfile,
        }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Chatbot not available. Check backend.",
        },
      ]);
    }

    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700"
      >
        <FaRobot />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-indigo-600 text-white p-3 flex justify-between">
        <span>AI Assistant</span>
        <button onClick={() => setOpen(false)}>×</button>
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl text-sm ${
              c.sender === "user"
                ? "bg-indigo-600 text-white ml-10"
                : "bg-white border mr-10"
            }`}
          >
            {c.text}
          </div>
        ))}

        {loading && <p className="text-sm">Thinking...</p>}
      </div>

      <div className="flex p-2 border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask..."
          className="flex-1 border rounded px-2"
        />

        <button onClick={sendMessage} className="px-3 text-indigo-600">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default CareerChatbot;