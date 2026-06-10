"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader, User, Bot, Phone, Clock } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot" | "agent";
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickReply {
  id: string;
  label: string;
  message: string;
}

const QUICK_REPLIES: QuickReply[] = [
  { id: "1", label: "Shipping Status", message: "Where is my order?" },
  { id: "2", label: "Payment Help", message: "I'm having trouble with payment" },
  { id: "3", label: "Product Info", message: "Tell me more about a product" },
  { id: "4", label: "Returns", message: "How do I return an item?" },
  { id: "5", label: "Talk to Agent", message: "I'd like to speak with a live agent" },
];

const BOT_RESPONSES: Record<string, string> = {
  "where is my order?": "I can help you track your order! To look up your order status, I'll need your order number or email address. What is your order number?",
  "i'm having trouble with payment": "I'm sorry you're experiencing payment issues. Common solutions include: 1) Checking your card details, 2) Ensuring your billing address matches your card, 3) Trying a different payment method. Would you like me to connect you with a live agent for more help?",
  "tell me more about a product": "I'd be happy to help! Which product are you interested in learning more about? You can describe it or tell me the product name.",
  "how do i return an item?": "Our return policy allows returns within 30 days of purchase. Items must be in original condition. To start a return, please visit your order page or contact our support team. Would you like to speak with an agent?",
  "i'd like to speak with a live agent": "Of course! I'm connecting you with a live agent now. Please hold while we find the next available representative.",
  default: "Thanks for your message! I'm here to help. If you need more specific assistance, I can connect you with a live agent. Would that be helpful?",
};

export default function LiveSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "👋 Hi! Welcome to BTS Arirang World Tour Support. How can we help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [agentName, setAgentName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate bot typing
  const simulateBotTyping = (delay: number = 1500) => {
    return new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        resolve(null);
      }, delay);
    });
  };

  // Handle user message
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // If agent is connected, show agent response
    if (agentConnected) {
      await simulateBotTyping(2000);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        text: `Thanks for reaching out! I'm ${agentName} from our support team. I'm here to help with your question about "${text}". What specific information do you need?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      return;
    }

    // Check if user wants to escalate to agent
    if (
      text.toLowerCase().includes("agent") ||
      text.toLowerCase().includes("human") ||
      text.toLowerCase().includes("representative")
    ) {
      await simulateBotTyping(1500);
      const escalationMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "🔄 Connecting you with a live agent... Please hold.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, escalationMsg]);

      // Simulate agent connection
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const agents = ["Sarah", "Marcus", "Priya", "James"];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      setAgentName(randomAgent);
      setAgentConnected(true);

      const connectedMsg: Message = {
        id: (Date.now() + 2).toString(),
        type: "agent",
        text: `✅ You're now connected with ${randomAgent} from our support team. How can I assist you today?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, connectedMsg]);
      return;
    }

    // Get bot response
    await simulateBotTyping();
    const responseText =
      BOT_RESPONSES[text.toLowerCase()] || BOT_RESPONSES.default;
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      text: responseText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Handle quick reply click
  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.message);
  };

  // Check if we should show quick replies
  const shouldShowQuickReplies =
    !isLoading &&
    !agentConnected &&
    messages.length <= 2 &&
    messages[messages.length - 1]?.type === "bot";

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center font-bold text-white ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 scale-110"
            : "bg-gradient-to-r from-purple-600 to-black hover:shadow-xl hover:scale-105"
        }`}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {agentConnected ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {agentConnected ? `${agentName} - Live Agent` : "Support Assistant"}
                </p>
                <p className="text-xs opacity-75 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {agentConnected ? "Online" : "AI-Powered"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-black text-white rounded-br-none"
                      : msg.type === "agent"
                      ? "bg-purple-100 text-gray-800 rounded-bl-none border border-purple-200"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {shouldShowQuickReplies && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition font-medium"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agent Info */}
          {agentConnected && (
            <div className="px-4 py-2 bg-purple-50 border-t border-purple-200 text-xs text-purple-700 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>
                <strong>{agentName}</strong> is available to help. Response time is typically under 1 minute.
              </span>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={agentConnected ? "Message your agent..." : "Ask me anything..."}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-full p-2 transition flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
