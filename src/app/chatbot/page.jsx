"use client";
import './style.css';
import { useState, useEffect, useRef } from "react";
import { Navbar } from '@/components/navbar/Navbar';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import rehypeRaw from 'rehype-raw'; // Optional: If you need to support raw HTML

export default function Chat() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Chat About Energy", messages: [] },
  ]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [input, setInput] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Typing indicator state
  const messageEndRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/chat/", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        const csrfToken = response.headers.get("X-CSRFToken");
        setCsrfToken(csrfToken);
      })
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);


  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversationId) {
        return { ...conv, messages: [...conv.messages, userMessage] };
      }
      return conv;
    });
    setConversations(updatedConversations);

    setIsTyping(true); // Show typing indicator

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrfToken,
        },
        body: new URLSearchParams({
          user_id: activeConversationId.toString(),
          message: input,
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };
      const updatedConversationsWithBotResponse = updatedConversations.map(
        (conv) => {
          if (conv.id === activeConversationId) {
            return { ...conv, messages: [...conv.messages, botMessage] };
          }
          return conv;
        }
      );
      setConversations(updatedConversationsWithBotResponse);
      setIsTyping(false); // Hide typing indicator after response
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }

    setInput("");
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="w-[90vw] h-[90vh] shadow-2xl rounded-lg bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <header className="p-4 bg-yellow-50 text-black flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full shadow-md mr-4"
          />
          <h1 className="text-xl font-bold">Green Energy Park virtual assistant</h1>
        </header>
        {/* End Header */}

        {/* Message Area */}
        <main className="flex-grow p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {activeConversation?.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  msg.sender === "user" ? "justify-end" : ""
                }`}
              >
                {/* Bot Profile Icon */}
                {msg.sender === "bot" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="Bot Avatar"
                    className="h-8 w-8 rounded-full mr-3"
                  />
                )}

                <div
                  className={`p-4 rounded-lg max-w-xl shadow text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {/* Render the message */}
                  {msg.sender === "bot" ? (
                    // Parse the bot's response using react-markdown
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    // User message as plain text
                    <>{msg.text}</>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                  alt="Bot Avatar"
                  className="h-8 w-8 rounded-full mr-3"
                />
                <div className="bg-gray-200 p-3 rounded-lg text-gray-500 text-sm">
                  responding...
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        </main>
        {/* End Message Area */}

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-gray-300 flex items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 shadow-sm"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Send
            </button>
          </form>
        </footer>
        {/* End Input Area */}
      </div>
    </div>
  );
}
