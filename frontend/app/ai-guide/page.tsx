"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { findFAQ } from "../../src/lib/faq";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  moduleLink?: string;
  contextCategory?: string;
  feedback?: "helpful" | "not_helpful";
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Campus Guide. I can help you locate campus services, rules, and information. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Where is today's mess menu?",
    "How do I report a lost ID card?",
    "Are there rides to the station tomorrow?",
    "How do I track my parcel?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Get context from last assistant message if possible
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");
    const currentContext = lastAssistantMsg?.contextCategory;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const faqMatch = findFAQ(trimmed, currentContext);

    if (faqMatch) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: faqMatch.answer,
          moduleLink: faqMatch.moduleLink,
          contextCategory: faqMatch.category,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I couldn't find verified information about that in the available campus knowledge base. Please check the relevant campus office or official source.",
        },
      ]);
    }
    
    setIsLoading(false);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not_helpful") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
    // In a real app, this would post to an API
    console.log(`[Demo] Feedback received for ${messageId}: ${feedback}`);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI Campus Guide. I can help you locate campus services, rules, and information. How can I assist you today?",
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-slate-50 flex-col md:flex-row">
      {/* Optional: Navigation Sidebar mimicking the main app (Simplified) */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-4 flex flex-col md:h-full shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 rounded-lg p-2 text-white font-bold text-xl leading-none">
            AP
          </div>
          <h1 className="text-xl font-bold tracking-tight">Amrita Plexus</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition">
            Main Dashboard
          </Link>
          <div className="px-3 py-2 rounded-xl bg-indigo-600 text-white shadow-sm font-semibold">
            AI Campus Guide
          </div>
        </nav>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Campus Guide</h2>
            <p className="text-sm text-slate-500">Ask verified campus information</p>
          </div>
          <button
            onClick={clearConversation}
            className="text-sm text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md px-3 py-1.5 transition"
          >
            Clear Conversation
          </button>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                }`}
              >
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
                
                {msg.moduleLink && (
                  <div className="mt-3">
                    <Link
                      href={msg.moduleLink}
                      className="inline-block bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-lg text-sm transition"
                    >
                      Go to {msg.moduleLink.replace("/", "").replace("-", " ")} &rarr;
                    </Link>
                  </div>
                )}

                {msg.role === "assistant" && msg.id !== "welcome" && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                    <span className="text-xs text-slate-400">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(msg.id, "helpful")}
                      className={`text-xs px-2 py-1 rounded transition ${
                        msg.feedback === "helpful"
                          ? "bg-green-100 text-green-700 font-semibold"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      aria-label="Helpful"
                    >
                      👍 Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, "not_helpful")}
                      className={`text-xs px-2 py-1 rounded transition ${
                        msg.feedback === "not_helpful"
                          ? "bg-red-100 text-red-700 font-semibold"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      aria-label="Not Helpful"
                    >
                      👎 No
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0">
          {messages.length <= 2 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider py-1.5 w-full md:w-auto">Suggested:</span>
              {suggestedQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sq)}
                  className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition"
                >
                  {sq}
                </button>
              ))}
            </div>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask about campus services, rules, or navigation..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none max-h-32 text-slate-900"
                rows={1}
                style={{ minHeight: "52px" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white h-[52px] px-6 rounded-xl font-semibold shadow-sm transition flex items-center justify-center shrink-0"
            >
              Send
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-slate-400">
            Answers are generated from the approved campus knowledge base. Verify critical details with official sources.
          </div>
        </div>
      </div>
    </div>
  );
}
