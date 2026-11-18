"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  Stethoscope,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IChatMessage, IConversation } from "@/types/doctor.interface";
import { getOrCreatePatientConversation, sendChatMessage } from "@/services/doctor/chatServices";
import { cn } from "@/lib/utils";

// Web Audio API chime generator for incoming messages
function playMessageChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    // AudioContext blocked or not supported
  }
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Connect Socket.io
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (conversation?.id) {
        socket.emit("join_conversation", conversation.id);
      }
    });

    socket.on("receive_message", (data: { message: IChatMessage; conversationId: string }) => {
      if (data?.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        setIsTyping(false);
        if (soundEnabled) {
          playMessageChime();
        }
      }
    });

    socket.on("typing_indicator", (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversation?.id, soundEnabled]);

  // Start chat session
  const handleStartChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = patientName.trim() || "Guest Patient";
    setLoading(true);

    try {
      const conv = await getOrCreatePatientConversation({
        patientName: name,
        initialMessage: inputValue.trim() || undefined,
      });

      if (conv) {
        setConversation(conv);
        setMessages(conv.messages || []);
        setHasStarted(true);

        if (socketRef.current) {
          socketRef.current.emit("join_conversation", conv.id);
        }

        if (inputValue.trim()) {
          setInputValue("");
        }
      }
    } catch (err) {
      console.error("Failed to start chat session:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversation) return;

    const text = inputValue.trim();
    setInputValue("");

    // Optimistic temporary message
    const tempMsg: IChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      senderType: "PATIENT",
      content: text,
      isAi: false,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Emit via Socket.io
    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        conversationId: conversation.id,
        content: text,
        senderType: "PATIENT",
      });
    }

    // Backend REST backup
    sendChatMessage(conversation.id, text, "PATIENT").then((res) => {
      if (res?.aiReply) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.aiReply?.id)) return prev;
          return [...prev, res.aiReply!];
        });
        if (soundEnabled) playMessageChime();
      }
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 h-14 px-5 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open Live Doctor Chat"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-primary animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Chat with Doctor</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </div>
            <div className="text-[10px] text-primary-foreground/80 leading-tight">
              Instant AI & Chamber Support
            </div>
          </div>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div
          className={cn(
            "flex flex-col bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300",
            isMinimized
              ? "w-80 h-14"
              : "w-[360px] sm:w-[400px] h-[550px] max-h-[85vh]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-9 w-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Stethoscope className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate flex items-center gap-1.5">
                  <span>AI Assistant</span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-white/20 text-white border-0 font-medium">
                    Online
                  </Badge>
                </div>
                <div className="text-[11px] text-primary-foreground/80 truncate">
                  Instant Chamber & Appointment Support
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? "Mute chimes" : "Enable chimes"}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Minimal Clean Pre-Chat Name Intake */}
              {!hasStarted ? (
                <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-y-auto bg-card">
                  <form onSubmit={handleStartChat} className="w-full max-w-[320px] space-y-5 text-center">
                    <div className="space-y-2">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
                        <Bot className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight">
                        Chat with Assistant
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Please provide your name to start conversation.
                      </p>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label htmlFor="patientName" className="text-xs font-semibold text-foreground">
                        Your Name
                      </label>
                      <Input
                        id="patientName"
                        placeholder="e.g. Kamal Hasan"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="rounded-xl h-11 text-sm bg-muted/40 focus:bg-background"
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      isLoading={loading}
                      className="w-full rounded-xl h-11 text-sm font-semibold shadow-sm"
                    >
                      Start Chat
                    </Button>
                  </form>
                </div>
              ) : (
                /* Active Chat Messages Feed */
                <div className="flex-1 flex flex-col min-h-0 bg-muted/20">
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                    {/* Welcome notice */}
                    <div className="p-3 rounded-xl bg-card border border-border/70 text-center space-y-0.5 shadow-xs">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Assistant Connected</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Ask any question about appointments, consultation fees, or chamber timings.
                      </p>
                    </div>

                    {messages.map((msg) => {
                      const isPatient = msg.senderType === "PATIENT";
                      return (
                        <div
                          key={msg.id}
                          className={cn("flex flex-col", isPatient ? "items-end" : "items-start")}
                        >
                          <div className="flex items-center gap-1 mb-1 text-[10px] text-muted-foreground font-medium">
                            {isPatient ? (
                              <span>You</span>
                            ) : msg.isAi ? (
                              <span className="flex items-center gap-1 text-primary font-semibold">
                                <Bot className="h-3 w-3" /> AI Assistant
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Stethoscope className="h-3 w-3" /> Doctor
                              </span>
                            )}
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>

                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words shadow-xs",
                              isPatient
                                ? "bg-primary text-primary-foreground rounded-tr-xs"
                                : "bg-card border border-border/70 text-foreground rounded-tl-xs"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/60 text-xs text-muted-foreground w-fit">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-[11px]">Assistant is drafting a response...</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Footer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-card border-t border-border/70 flex items-center gap-2"
                  >
                    <Input
                      placeholder="Type your health or appointment question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="rounded-xl h-10 text-xs flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim()}
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

