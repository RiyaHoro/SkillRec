import { useEffect, useRef, useState } from "react";

function CareerChatbot({ career, userProfile }) {
  
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I am your SkillSakhi AI Career Assistant. Ask me about career path, skills, courses, resume, or jobs.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (customMessage = null) => {
    const userText = customMessage || input;

    if (!userText.trim()) return;

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
          text: data.reply?.includes("offline")
            ? "⚠️ " + data.reply
            : data.reply || "Sorry, I could not answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Chatbot is not connected. Make sure Flask backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Give me a career roadmap",
    "What skills should I learn?",
    "Suggest resume tips",
    "Which courses should I take?",
    "How can I get an internship?",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-5 mt-8 border border-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700">
            🤖 SkillSakhi AI Assistant
          </h2>
          <p className="text-sm text-gray-500">
            Personalized career guidance for{" "}
            <span className="font-semibold text-indigo-600">
              {career?.career_name || "your selected career"}
            </span>
          </p>
        </div>

        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          Online
        </span>
      </div>

      {/* Chat Box */}
      <div
        ref={chatBoxRef}
        className="h-80 overflow-y-auto bg-gray-100 rounded-2xl p-4 space-y-3"
      >
        {" "}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-indigo-600 text-white ml-auto rounded-br-sm"
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-white text-gray-500 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[70%] shadow-sm animate-pulse">
            🤖 Thinking...
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => sendMessage(question)}
            className="text-xs bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-200 transition font-medium"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 bg-gray-100 p-2 rounded-2xl border border-gray-200">
        <input
          type="text"
          placeholder="Ask about skills, courses, roadmap, resume..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-transparent outline-none px-3 text-sm"
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CareerChatbot;
