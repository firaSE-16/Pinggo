import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { Message, ChatPartner, fetchMessages, sendMessage, markMessagesAsRead } from '@/services/chatService';
import { showChatNotification } from '@/services/notificationService';

interface UseChatProps {
  partnerId: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  isTyping: boolean;
  partner: ChatPartner | null;
  unreadCount: number;
  markAsRead: () => void;
}

export const useChat = ({ partnerId }: UseChatProps): UseChatReturn => {
  const { user: currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!partnerId || !currentUser) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMessages = await fetchMessages(partnerId);
      setMessages(fetchedMessages);
      
      // Mark messages as read
      await markMessagesAsRead(partnerId);
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, currentUser]);

  // Send message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !partnerId || !currentUser) return;
    
    try {
      const newMessage = await sendMessage(partnerId, text.trim());
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [partnerId, currentUser, scrollToBottom]);

  // Mark messages as read
  const handleMarkAsRead = useCallback(async () => {
    if (!partnerId) return;
    
    try {
      await markMessagesAsRead(partnerId);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [partnerId]);

  // Socket connection and real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;

    connectSocket(currentUser.id);

    // Listen for incoming messages
    const handleNewMessage = (data: any) => {
      if (
        (data.from === currentUser.id && data.to === partnerId) ||
        (data.from === partnerId && data.to === currentUser.id)
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
        
        setMessages(prev => [...prev, newMessage]);
        
        // If message is from partner, mark as read and update unread count
        if (data.from === partnerId) {
          setUnreadCount(prev => prev + 1);
          handleMarkAsRead();
          
          // Show notification if not in focus
          if (document.hidden) {
            showChatNotification(data.senderName || 'Someone', data.message);
          }
        }
        
        scrollToBottom();
      }
    };

    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      disconnectSocket();
    };
  }, [currentUser?.id, partnerId, handleMarkAsRead, scrollToBottom]);

  // Load messages when partner changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    isTyping,
    partner,
    unreadCount,
    markAsRead: handleMarkAsRead,
  };
}; 