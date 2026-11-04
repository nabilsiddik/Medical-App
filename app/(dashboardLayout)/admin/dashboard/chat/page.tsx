"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Search,
  Send,
  Bot,
  User,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import { IConversation, IChatMessage } from "@/types/doctor.interface";
import {
  getConversations,
  getConversationById,
  sendChatMessage,
} from "@/services/doctor/chatServices";
import { cn } from "@/lib/utils";

// Web Audio API chime
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch {}
}

export default function DoctorChatInboxPage() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [patientTyping, setPatientTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat container (without scrolling the outer window)
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, patientTyping]);

  // Load conversations
  const fetchConversations = async (search?: string) => {
    try {
      const data = await getConversations(search);
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        loadConversationDetails(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (id: string) => {
    try {
      const conv = await getConversationById(id);
      if (conv) {
        setSelectedConversation(conv);
        setMessages(conv.messages || []);

        if (socketRef.current) {
          socketRef.current.emit("join_conversation", conv.id);
          socketRef.current.emit("mark_read", { conversationId: conv.id });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Connect Socket.io
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (selectedConversation?.id) {
        socket.emit("join_conversation", selectedConversation.id);
      }
    });

    socket.on("receive_message", (data: { message: IChatMessage; conversationId: string }) => {
      if (data?.message) {
        if (selectedConversation && data.conversationId === selectedConversation.id) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
        if (soundEnabled) playChime();

        // Refresh conversation preview list
        fetchConversations(searchTerm);
      }
    });

    socket.on("typing_indicator", (data: { isTyping: boolean }) => {
      setPatientTyping(data.isTyping);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversation?.id, soundEnabled, searchTerm]);

  // Handle Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConversations(searchTerm);
  };

  // Send Doctor Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversation) return;

    const text = inputText.trim();
    setInputText("");

    // Optimistic message
    const tempMsg: IChatMessage = {
      id: `doc-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderType: "DOCTOR",
      content: text,
      isAi: false,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Socket emit
    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        conversationId: selectedConversation.id,
        content: text,
        senderType: "DOCTOR",
      });
    }

    // Backend save
    await sendChatMessage(selectedConversation.id, text, "DOCTOR");
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>Practice Live Chat Inbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time messenger interface to view patient chats, supervise AI replies, and provide direct medical consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? "Sound ON" : "Sound Muted"}</span>
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchConversations(searchTerm)}
            className="rounded-xl text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Link href="/admin/dashboard/google-sheet">
            <Button size="sm" className="rounded-xl text-xs font-semibold">
              <Bot className="h-3.5 w-3.5 mr-1" /> Google Sheet KB
            </Button>
          </Link>
        </div>
      </div>

      {/* Messenger Split-Pane Layout */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:grid md:grid-cols-12 h-[calc(100vh-14rem)] min-h-[550px]">
            {/* Left Conversations Sidebar (4 cols on desktop, full width on mobile) */}
            <div
              className={cn(
                "md:col-span-5 lg:col-span-4 border-r border-border/70 flex flex-col h-full bg-muted/10 min-h-0",
                mobileShowChat ? "hidden md:flex" : "flex flex-1"
              )}
            >
              {/* Search Bar */}
              <div className="p-3 border-b border-border/70 bg-card shrink-0">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8.5 rounded-xl h-9 text-xs"
                  />
                </form>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-border/50 min-h-0">
                {conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const isSelected = selectedConversation?.id === conv.id;
                    const lastMsg = conv.messages?.[conv.messages.length - 1];

                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => {
                          loadConversationDetails(conv.id);
                          setMobileShowChat(true);
                        }}
                        className={cn(
                          "w-full text-left p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative border-l-4",
                          isSelected
                            ? "bg-primary/10 border-l-primary"
                            : "border-l-transparent hover:bg-muted/30"
                        )}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {conv.patientName ? conv.patientName[0].toUpperCase() : "P"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-xs text-foreground truncate">
                              {conv.patientName}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                              {conv.lastMessageAt
                                ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>

                          <p className="text-[11px] text-muted-foreground truncate">
                            {lastMsg?.content || "Started a consultation"}
                          </p>

                          <div className="flex items-center justify-between mt-1 pt-0.5">
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {conv.patientPhone || "Web Patient"}
                            </span>
                            {conv.unreadCountDoctor > 0 && (
                              <Badge className="h-4 px-1.5 text-[9px] font-bold rounded-full bg-primary text-primary-foreground">
                                {conv.unreadCountDoctor}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    {loading ? "Loading conversations..." : "No conversation records found."}
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Thread (8 cols on desktop, full width on mobile) */}
            <div
              className={cn(
                "md:col-span-7 lg:col-span-8 flex flex-col h-full bg-card min-h-0",
                mobileShowChat ? "flex flex-1" : "hidden md:flex"
              )}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-border/70 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Mobile Back Button */}
                      <button
                        type="button"
                        onClick={() => setMobileShowChat(false)}
                        className="md:hidden p-2 -ml-1 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                        title="Back to conversation list"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                        {selectedConversation.patientName ? selectedConversation.patientName[0].toUpperCase() : "P"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground truncate flex items-center gap-2">
                          <span>{selectedConversation.patientName}</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 truncate font-mono">
                          {selectedConversation.patientPhone && <span>📞 {selectedConversation.patientPhone}</span>}
                          {selectedConversation.patientEmail && <span>✉️ {selectedConversation.patientEmail}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedConversation.patientId && (
                        <Link href={`/admin/dashboard/prescriptions/new?patientId=${selectedConversation.patientId}`}>
                          <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-8">
                            <FileText className="h-3.5 w-3.5 mr-1" /> New Rx
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-muted/10 min-h-0">
                    {messages.map((msg) => {
                      const isDoctor = msg.senderType === "DOCTOR";
                      const isAi = msg.isAi || msg.senderType === "AI";
                      const isPatient = msg.senderType === "PATIENT";

                      return (
                        <div
                          key={msg.id}
                          className={cn("flex flex-col", isPatient ? "items-start" : "items-end")}
                        >
                          {/* Label */}
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground font-medium">
                            {isPatient ? (
                              <span className="font-semibold text-foreground">
                                {selectedConversation.patientName}
                              </span>
                            ) : isAi ? (
                              <span className="flex items-center gap-1 text-sky-600 font-semibold">
                                <Bot className="h-3 w-3" /> AI Auto-Reply
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Stethoscope className="h-3 w-3" /> You (Doctor)
                              </span>
                            )}
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>

                          {/* Bubble */}
                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words shadow-xs",
                              isPatient
                                ? "bg-muted text-foreground border border-border/70 rounded-tl-xs"
                                : isAi
                                ? "bg-sky-500/10 text-sky-950 dark:text-sky-100 border border-sky-500/20 rounded-tr-xs"
                                : "bg-primary text-primary-foreground rounded-tr-xs font-medium"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}

                    {/* Patient Typing Indicator */}
                    {patientTyping && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/60 text-xs text-muted-foreground w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[11px] font-medium">
                          {selectedConversation.patientName} is typing...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reply Input Bar */}
                  <form
                    onSubmit={handleSendReply}
                    className="p-3 border-t border-border/70 flex items-center gap-2 bg-card"
                  >
                    <Input
                      placeholder={`Reply directly to ${selectedConversation.patientName}...`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="rounded-xl h-11 text-xs flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="rounded-xl h-11 px-5 text-xs font-semibold gap-1.5 shrink-0"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Reply</span>
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">No Conversation Selected</h3>
                  <p className="text-xs max-w-sm mt-1">
                    Select a patient conversation from the left to view messages and reply in real time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

