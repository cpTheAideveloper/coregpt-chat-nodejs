import { useState, useRef, useEffect } from "react";
import { InputBox } from "../components/InputBox";
import { ChatBubble } from "../components/ChatBubble";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Banner } from "../components/Banner";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Each message: { role, content }
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (messages.length > 0) {
      setShowBanner(false);
    }
  }, [messages]);


  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
  
    if (showBanner) setShowBanner(false);
  
    const userMessage = { role: "user", content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:8000/sendText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: trimmed }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "An error occurred while sending your message." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {showBanner && (
          <Banner 
            title="Chat Interaction" 
            description="Interact with the AI in real-time. Simply type your message and receive an immediate response." 
          />
        )}
  
        {messages.map((msg, index) => (
          <ChatBubble key={index} {...msg} />
        ))}
  
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
  
      <InputBox
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        placeholder="Type your message..."
      />
    </div>
  );

}
