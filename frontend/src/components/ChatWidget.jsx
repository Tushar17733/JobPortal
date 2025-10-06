import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";

// Derive base URL from an existing endpoint constant so environments stay in sync
const CHAT_API_ENDPOINT = USER_API_ENDPOINT.replace("/api/v1/user", "/api/chat");

const INITIAL_SUGGESTIONS = [
  "How to apply?",
  "How to post a job?",
  "How to reset password?",
  "How to update my profile?"
];

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        } rounded-2xl px-3 py-2 max-w-[80%] whitespace-pre-wrap`}
      >
        {content}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Clear old chat on page reload: initialize empty; we only persist during this tab's lifetime
    sessionStorage.removeItem("jp_chat_messages");
    return [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const sessionId = useMemo(() => {
    // New session per full page load
    const id = crypto.randomUUID();
    sessionStorage.setItem("jp_chat_session_id", id);
    return id;
  }, []);

  useEffect(() => {
    sessionStorage.setItem("jp_chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;

    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        CHAT_API_ENDPOINT,
        { messages: nextMessages, userId: sessionId },
        { withCredentials: true, timeout: 20000 }
      );
      const assistant = {
        role: res.data?.role || "assistant",
        content: res.data?.message || "Sorry, I couldn't generate a response."
      };
      setMessages((prev) => [...prev, assistant]);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Network error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open support chat"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        {/* simple chat icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9.83L5.41 21.41A1 1 0 0 1 4 20.59V17H5a3 3 0 0 1-3-3V5z" />
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-[380px] h-[70vh] max-h-[540px] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">AI</span>
              <div className="font-semibold">Job Portal Assistant</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-90 hover:opacity-100">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-sm text-gray-600 bg-white border rounded-xl p-3">
                Hi! I can help with your job search and employer tasks. Try asking:
                <div className="mt-2 flex flex-wrap gap-2">
                  {INITIAL_SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div className="w-full flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl text-gray-700 text-sm">Thinking…</div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}


