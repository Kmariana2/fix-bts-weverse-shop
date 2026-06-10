"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Search,
  Send,
  Clock,
  MapPin,
  ShoppingCart,
  User,
  Phone,
  Mail,
  X,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Bell,
  ChevronLeft,
  Menu,
} from "lucide-react";

interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: "waiting" | "active" | "resolved";
  currentPage: string;
  cartItems: number;
  cartValue: number;
  lastMessage: string;
  timestamp: Date;
  messages: Array<{
    id: string;
    sender: "user" | "agent";
    text: string;
    time: Date;
  }>;
}

interface DashboardStats {
  activeChats: number;
  waitingChats: number;
  resolvedToday: number;
  avgResponseTime: string;
}

// Mock data for demo
const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    userName: "Jessica M.",
    userEmail: "jessica@example.com",
    userPhone: "+1 (555) 123-4567",
    status: "waiting",
    currentPage: "/checkout",
    cartItems: 3,
    cartValue: 287.50,
    lastMessage: "I'm having trouble with payment",
    timestamp: new Date(Date.now() - 2 * 60000),
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Hi, I'm trying to complete my purchase but my card keeps getting declined",
        time: new Date(Date.now() - 2 * 60000),
      },
      {
        id: "m2",
        sender: "user",
        text: "I've tried 3 times already",
        time: new Date(Date.now() - 1.5 * 60000),
      },
    ],
  },
  {
    id: "session-2",
    userName: "Alex K.",
    userEmail: "alex@example.com",
    userPhone: "+1 (555) 234-5678",
    status: "active",
    currentPage: "/product/3",
    cartItems: 1,
    cartValue: 49.00,
    lastMessage: "Can you tell me about the Vinyl Spinner?",
    timestamp: new Date(Date.now() - 5 * 60000),
    messages: [
      {
        id: "m3",
        sender: "user",
        text: "Can you tell me about the Vinyl Spinner?",
        time: new Date(Date.now() - 5 * 60000),
      },
      {
        id: "m4",
        sender: "agent",
        text: "Of course! The Vinyl Spinner is a limited edition BTS collectible. It features...",
        time: new Date(Date.now() - 4 * 60000),
      },
      {
        id: "m5",
        sender: "user",
        text: "Great! I'll add it to my cart",
        time: new Date(Date.now() - 2 * 60000),
      },
    ],
  },
  {
    id: "session-3",
    userName: "Morgan T.",
    userEmail: "morgan@example.com",
    userPhone: "+1 (555) 345-6789",
    status: "waiting",
    currentPage: "/",
    cartItems: 0,
    cartValue: 0,
    lastMessage: "Where is my order?",
    timestamp: new Date(Date.now() - 8 * 60000),
    messages: [
      {
        id: "m6",
        sender: "user",
        text: "Where is my order? I ordered 3 days ago",
        time: new Date(Date.now() - 8 * 60000),
      },
    ],
  },
];

function AdminSupportPageContent() {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(MOCK_SESSIONS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    activeChats: 1,
    waitingChats: 2,
    resolvedToday: 12,
    avgResponseTime: "2m 15s",
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Handle deep-linking from notifications
  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    const autoOpen = searchParams.get("autoOpen");
    if (sessionId && autoOpen === "true") {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setSelectedSession(session);
        setShowSidebar(false);
        // Scroll to top to show the chat
        window.scrollTo(0, 0);
      }
    }
  }, [searchParams, sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages]);

  // Request notification permission
  const handleEnableNotifications = async () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          new Notification("Support Notifications Enabled", {
            body: "You'll now receive alerts for new support requests",
            icon: "/favicon.ico",
          });
        }
      }
    }
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedSession) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: "agent" as const,
      text: messageInput,
      time: new Date(),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSession.id
          ? {
              ...s,
              messages: [...s.messages, newMessage],
              lastMessage: messageInput,
              timestamp: new Date(),
            }
          : s
      )
    );

    setSelectedSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: messageInput,
            timestamp: new Date(),
          }
        : null
    );

    setMessageInput("");
  };

  // Handle resolving chat
  const handleResolveChat = () => {
    if (!selectedSession) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSession.id ? { ...s, status: "resolved" } : s
      )
    );

    setSelectedSession((prev) =>
      prev ? { ...prev, status: "resolved" } : null
    );

    setTimeout(() => {
      const nextWaiting = sessions.find((s) => s.status === "waiting");
      if (nextWaiting) setSelectedSession(nextWaiting);
    }, 1000);
  };

  // Filter sessions based on search
  const filteredSessions = sessions.filter((s) =>
    s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-red-100 text-red-700 border-red-300";
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "resolved":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row" suppressHydrationWarning>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="font-bold text-gray-900">Support</h1>
        <button
          onClick={handleEnableNotifications}
          className={`p-2 rounded-lg transition ${
            notificationsEnabled
              ? "bg-green-100 text-green-600"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar / Sessions List */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-96 border-r border-gray-200 bg-white overflow-hidden`}
      >
        {/* Desktop Header */}
        <div className="hidden md:block border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support</h1>
              <p className="text-sm text-gray-500">Manage live chats</p>
            </div>
            <button
              onClick={handleEnableNotifications}
              className={`p-2 rounded-lg transition ${
                notificationsEnabled
                  ? "bg-green-100 text-green-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{stats.activeChats}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">{stats.waitingChats}</p>
              <p className="text-xs text-gray-500">Waiting</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{stats.resolvedToday}</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-600">{stats.avgResponseTime}</p>
              <p className="text-xs text-gray-500">Avg Time</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No sessions found</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setSelectedSession(session);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition border-l-4 ${
                    selectedSession?.id === session.id
                      ? "border-l-black bg-blue-50"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{session.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{session.userEmail}</p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold border flex-shrink-0 whitespace-nowrap ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status === "waiting" && "🔴"}
                      {session.status === "active" && "🟢"}
                      {session.status === "resolved" && "✓"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {session.lastMessage}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(
                        (Date.now() - session.timestamp.getTime()) / 60000
                      )}m
                    </span>
                    {session.cartItems > 0 && (
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        <ShoppingCart className="w-3 h-3" />
                        ${session.cartValue.toFixed(2)}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">{selectedSession.userName}</h2>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{selectedSession.userEmail}</p>
                </div>
                <span
                  className={`ml-2 px-2 md:px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(
                    selectedSession.status
                  )}`}
                >
                  {selectedSession.status === "waiting" && "🔴 Waiting"}
                  {selectedSession.status === "active" && "🟢 Active"}
                  {selectedSession.status === "resolved" && "✓ Resolved"}
                </span>
              </div>

              {/* User Context */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-600 truncate">
                  <Phone className="w-3 h-3 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{selectedSession.userPhone}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 truncate">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{selectedSession.currentPage}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <ShoppingCart className="w-3 h-3 flex-shrink-0 text-gray-400" />
                  <span>{selectedSession.cartItems} items</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-semibold">
                  <TrendingUp className="w-3 h-3 flex-shrink-0" />
                  <span>${selectedSession.cartValue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gray-50">
              {selectedSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm ${
                      msg.sender === "agent"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "agent" ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {selectedSession.status !== "resolved" && (
              <div className="border-t border-gray-200 px-3 md:px-6 py-3 md:py-4 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2 md:gap-3 mb-2 md:mb-3"
                >
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-2 font-semibold text-sm flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden md:inline">Send</span>
                  </button>
                </form>

                {/* Resolve Button */}
                <button
                  onClick={handleResolveChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition font-semibold text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Resolved
                </button>
              </div>
            )}

            {/* Resolved State */}
            {selectedSession.status === "resolved" && (
              <div className="border-t border-gray-200 px-3 md:px-6 py-3 md:py-4 bg-green-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  Chat resolved
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center bg-gray-50 h-full">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-medium">Select a chat to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AdminSupportPageContent />
    </Suspense>
  );
}
