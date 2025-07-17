import { create } from 'zustand';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { fetchMessages as fetchMessagesApi, sendMessage as sendMessageApi } from '@/services/chatService';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  unreadCount: number;
  online: boolean;
  onlineUsers: string[];
  fetchMessages: (profileId: string, partnerId: string) => Promise<void>;
  sendMessage: (profileId: string, partnerId: string, text: string) => Promise<void>;
  connectChatSocket: (profileId: string, partnerId: string) => void;
  disconnectChatSocket: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
  unreadCount: 0,
  online: false,
  onlineUsers: [],

  fetchMessages: async (profileId, partnerId) => {
    set({ isLoading: true, error: null });
    try {
      const msgs = await fetchMessagesApi(partnerId); // API expects partnerId
      set({ messages: msgs, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load messages', isLoading: false });
    }
  },

  sendMessage: async (profileId, partnerId, text) => {
    // Optimistically add message to UI
    const optimisticMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: profileId,
      receiverId: partnerId,
      message: text,
      type: 'TEXT',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, optimisticMsg] }));
    // Emit socket event for real-time
    socket.emit('chat:message', {
      from: profileId,
      to: partnerId,
      message: text,
      timestamp: optimisticMsg.createdAt,
    });
    // Persist to API in background
    try {
      const newMsg = await sendMessageApi(partnerId, text);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === optimisticMsg.id ? newMsg : msg
        ),
      }));
    } catch (err) {
      set({ error: 'Failed to send message' });
    }
  },

  connectChatSocket: (profileId, partnerId) => {
    // Always emit user:online (even if already connected)
    socket.connect();
    socket.emit('user:online', profileId);
    set({ online: true });
    // Listen for incoming messages
    const handleNewMessage = (data: any) => {
      if (
        (data.from === profileId && data.to === partnerId) ||
        (data.from === partnerId && data.to === profileId)
      ) {
        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: data.from,
          receiverId: data.to,
          message: data.message,
          type: 'TEXT',
          status: 'sent',
          createdAt: data.timestamp,
          updatedAt: data.timestamp,
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    };
    socket.on('chat:message', handleNewMessage);
    // Listen for online users
    const handleUsersOnline = (userIds: string[]) => {
      set({ onlineUsers: userIds, online: userIds.includes(profileId) });
    };
    socket.on('users:online', handleUsersOnline);
    // Save handlers for cleanup
    (get() as any)._handleNewMessage = handleNewMessage;
    (get() as any)._handleUsersOnline = handleUsersOnline;
  },

  disconnectChatSocket: () => {
    // Remove socket listeners
    const handlerMsg = (get() as any)._handleNewMessage;
    if (handlerMsg) socket.off('chat:message', handlerMsg);
    const handlerOnline = (get() as any)._handleUsersOnline;
    if (handlerOnline) socket.off('users:online', handlerOnline);
    disconnectSocket();
    set({ online: false, onlineUsers: [] });
  },

  clearMessages: () => set({ messages: [] }),
})); 