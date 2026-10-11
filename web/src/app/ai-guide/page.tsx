"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { findFAQ } from "@/lib/faq";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Sparkles,
  RotateCcw,
  Send,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  moduleLink?: string;
  contextCategory?: string;
  feedback?: "helpful" | "not_helpful";
}

let messageCounter = 0;
function generateMessageId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI Campus Guide. I can help you find verified information about campus services, mess schedules, hostel logistics, and navigation. How can I assist you today?",
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
      id: generateMessageId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    const currentContext = lastAssistantMsg?.contextCategory;

    // Simulate instant AI query processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    const faqMatch = findFAQ(trimmed, currentContext);

    if (faqMatch) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
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
          id: generateMessageId(),
          role: "assistant",
          content:
            "I couldn't find verified information regarding that specific query in the approved campus knowledge base. Please check with the respective department desk or administrative office.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not_helpful") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI Campus Guide. I can help you find verified information about campus services, mess schedules, hostel logistics, and navigation. How can I assist you today?",
      },
    ]);
  };

  return (
    <RouteGuard>
      <AppLayout
        breadcrumb="Student Portal / AI Campus Guide"
        title="AI Campus Knowledge Assistant"
      >
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Top Hero Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Verified Campus Knowledge Base
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>✨</span> AI Campus Guide
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Instant answers on dining menus, parcel collections, lost belongings, and transit rules verified by campus administration.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={clearConversation}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  Clear Chat
                </button>
              </div>
            </div>
          </div>

          {/* Quick Suggested Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
              Suggested:
            </span>
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                className="text-xs font-semibold bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200/80 px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Main Chat Container Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-[600px]">
            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAFC]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-xs"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {msg.moduleLink && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <Link
                          href={msg.moduleLink}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <span>Open {msg.moduleLink.replace("/", "").replace("-", " ")} module</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}

                    {msg.role === "assistant" && msg.id !== "welcome" && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Verified Answer</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(msg.id, "helpful")}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                              msg.feedback === "helpful"
                                ? "bg-emerald-50 text-emerald-700 font-bold"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Helpful
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "not_helpful")}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                              msg.feedback === "not_helpful"
                                ? "bg-rose-50 text-rose-700 font-bold"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                            Not helpful
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200/80 text-slate-500 rounded-2xl rounded-bl-xs p-3.5 shadow-2xs flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150" />
                    <span className="text-xs font-medium text-slate-400 pl-1">Searching knowledge base...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about campus services, mess, rides, or facilities..."
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified answers from Amrita campus official guidelines
                </span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </RouteGuard>
  );
}
