import { api } from "@/lib/api";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  status: "sent" | "delivered" | "read";
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
  receiver?: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export interface ChatPartner {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export const fetchMessages = async (userId: string): Promise<Message[]> => {
  try {
    const res = await api.get(`/message/${userId}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw new Error("Failed to load messages");
  }
};

export const sendMessage = async (userId: string, text: string, type: string = "TEXT"): Promise<Message> => {
  try {
    const res = await api.post(`/message/${userId}`, { text, type });
    return res.data.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message");
  }
};

export const fetchChatPartners = async (): Promise<ChatPartner[]> => {
  try {
    const res = await api.get("/message/partners");
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch chat partners:", error);
    throw new Error("Failed to load chat list");
  }
};

export const markMessagesAsRead = async (userId: string): Promise<void> => {
  try {
    await api.put(`/message/${userId}/read`);
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
};
