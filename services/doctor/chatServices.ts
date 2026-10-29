import { serverFetch } from "@/lib/serverFetch";
import {
  IConversation,
  IChatMessage,
  IGoogleSheetStatus,
} from "@/types/doctor.interface";

// 1. Fetch conversations for Doctor Inbox
export const getConversations = async (
  searchTerm?: string
): Promise<IConversation[]> => {
  try {
    const query = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
    const res = await serverFetch.get(`/chat/conversations${query}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }
};

// 2. Fetch single conversation by ID
export const getConversationById = async (
  id: string
): Promise<IConversation | null> => {
  try {
    const res = await serverFetch.get(`/chat/conversations/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to load conversation ${id}:`, error);
    return null;
  }
};

// 3. Send message in conversation (triggers AI reply if enabled and sent by patient)
export const sendChatMessage = async (
  conversationId: string,
  content: string,
  senderType: "PATIENT" | "DOCTOR" = "DOCTOR"
): Promise<{ message: IChatMessage; aiReply?: IChatMessage } | null> => {
  try {
    const res = await serverFetch.post(`/chat/conversations/${conversationId}/messages`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, senderType }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return null;
  }
};

// 4. Patient opens or gets existing conversation
export const getOrCreatePatientConversation = async (payload: {
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  initialMessage?: string;
}): Promise<IConversation | null> => {
  try {
    const res = await serverFetch.post("/chat/conversations", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to get or create patient conversation:", error);
    return null;
  }
};

// 5. Connect and sync Google Sheet Knowledge Base
export const syncGoogleSheetKnowledgeBase = async (
  sheetUrl: string
): Promise<{ success: boolean; totalEntries: number; message: string }> => {
  try {
    const res = await serverFetch.post("/chat/google-sheet/sync", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheetUrl }),
    });
    const json = await res.json();
    return json.data || { success: false, totalEntries: 0, message: json.message };
  } catch (error: any) {
    return { success: false, totalEntries: 0, message: error?.message || "Sync failed" };
  }
};

// 6. Get Google Sheet status
export const getGoogleSheetStatus = async (): Promise<IGoogleSheetStatus> => {
  try {
    const res = await serverFetch.get("/chat/google-sheet/status", {
      cache: "no-store",
    });
    if (!res.ok) {
      return { isConnected: false, aiChatEnabled: true, totalEntries: 0 };
    }
    const json = await res.json();
    return json.data || { isConnected: false, aiChatEnabled: true, totalEntries: 0 };
  } catch {
    return { isConnected: false, aiChatEnabled: true, totalEntries: 0 };
  }
};

// 7. Toggle AI assistant auto-replies
export const toggleAiChatStatus = async (
  enabled: boolean
): Promise<{ success: boolean; aiChatEnabled: boolean }> => {
  try {
    const res = await serverFetch.patch("/chat/ai-toggle", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const json = await res.json();
    return json.data || { success: true, aiChatEnabled: enabled };
  } catch {
    return { success: false, aiChatEnabled: enabled };
  }
};

