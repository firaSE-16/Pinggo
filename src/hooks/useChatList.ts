import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { ChatPartner, fetchChatPartners } from '@/services/chatService';

interface UseChatListReturn {
  partners: ChatPartner[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  onlineUsers: string[];
}

export const useChatList = (): UseChatListReturn => {
  const { user: currentUser } = useUser();
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const loadPartners = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPartners = await fetchChatPartners();
      setPartners(fetchedPartners);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat list');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Socket connection for real-time updates
  useEffect(() => {
    if (!currentUser?.id) return;

    connectSocket(currentUser.id);

    // Listen for online users
    const handleOnlineUsers = (userIds: string[]) => {
      setOnlineUsers(userIds);
      
      // Update partner online status
      setPartners(prev => prev.map(partner => ({
        ...partner,
        isOnline: userIds.includes(partner.id)
      })));
    };

    // Listen for new messages to update last message
    const handleNewMessage = (data: any) => {
      if (data.from === currentUser.id || data.to === currentUser.id) {
        const partnerId = data.from === currentUser.id ? data.to : data.from;
        
        setPartners(prev => prev.map(partner => {
          if (partner.id === partnerId) {
            return {
              ...partner,
              lastMessage: data.message,
              lastMessageTime: data.timestamp,
              unreadCount: data.from === partnerId ? (partner.unreadCount || 0) + 1 : partner.unreadCount
            };
          }
          return partner;
        }));
      }
    };

    socket.on('users:online', handleOnlineUsers);
    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('users:online', handleOnlineUsers);
      socket.off('chat:message', handleNewMessage);
      disconnectSocket();
    };
  }, [currentUser?.id]);

  // Load partners when user changes
  useEffect(() => {
    loadPartners();
  }, [loadPartners]);

  return {
    partners,
    isLoading,
    error,
    refresh: loadPartners,
    onlineUsers,
  };
}; 