'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Mic, MoreVertical, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import { getOtherProfile } from '@/services/useOtherService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useChatStore } from '@/store/chatStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, isLoaded } = useUser();
  const [partner, setPartner] = useState<any>(null);
  const [isLoadingPartner, setIsLoadingPartner] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const partnerId = Array.isArray(id) ? id[0] : id;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('');

  // Zustand chat store
  const {
    messages,
    isLoading,
    error,
    isTyping,
    unreadCount,
    fetchMessages,
    sendMessage,
    connectChatSocket,
    disconnectChatSocket,
    clearMessages,
    online,
    onlineUsers,
  } = useChatStore();

  // Fetch current user's profileId from DB (one-time, on mount)
  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const res = await fetch('/api/profile/user-detail');
        const data = await res.json();
        setProfileId(data.data?.id || null);
      } catch (e) {
        setProfileId(null);
      }
    };
    if (isLoaded && currentUser) fetchProfileId();
  }, [isLoaded, currentUser]);

  // Connect socket and fetch messages when profileId and partnerId are ready
  useEffect(() => {
    if (!profileId || !partnerId) return;
    connectChatSocket(profileId, partnerId);
    fetchMessages(profileId, partnerId);
    return () => {
      disconnectChatSocket();
      clearMessages();
    };
  }, [profileId, partnerId, connectChatSocket, fetchMessages, disconnectChatSocket, clearMessages]);

  // Load partner info
  useEffect(() => {
    if (!partnerId) return;
    const loadPartner = async () => {
      try {
        setIsLoadingPartner(true);
        const response = await getOtherProfile(partnerId);
        setPartner(response.data);
      } catch (err) {
        setPartner(null);
      } finally {
        setIsLoadingPartner(false);
      }
    };
    loadPartner();
  }, [partnerId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Format message time
  const formatMessageTime = (timestamp: string) => dayjs(timestamp).format('HH:mm');

  // Check if message is from current user
  const isOwnMessage = (message: any) => message.senderId === profileId;

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profileId || !partnerId) return;
    await sendMessage(profileId, partnerId, newMessage.trim());
    setNewMessage('');
    inputRef.current?.focus();
  };

  // Handle key press for Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  if (!partnerId) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col h-full bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg",
          className
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Pinggo</span>
            </div>
            <h3 className="text-xl font-bold">Select a chat</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoadingPartner) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col h-full bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg",
          className
        )}
      >
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex space-x-4"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-56 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col h-full bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg",
          className
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Pinggo</span>
            </div>
            <p className="text-destructive text-lg font-semibold">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="rounded-[10px] h-11 px-6"
            >
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col h-full bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/40">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="md:hidden rounded-full h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-12 h-12 border-2 border-primary/30">
            <AvatarImage src={partner?.avatarUrl} />
            <AvatarFallback>
              {partner?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg">{partner?.fullName || partner?.username}</h3>
            <p className="text-sm text-muted-foreground">
              {partnerId && onlineUsers.includes(partnerId) ? (
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2" />
                  Online
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full mr-2" />
                  Offline
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="space-y-5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex space-x-4"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-56 rounded" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mb-6">
              <Send className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Start a conversation</h3>
            <p className="text-muted-foreground">
              Send a message to {partner?.fullName || partner?.username} to begin chatting
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any, i: number) => (
              <motion.div
                key={message.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-3 rounded-xl text-base font-medium",
                    "shadow-sm animate-fade-in",
                    isOwnMessage(message)
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted/40 text-foreground rounded-bl-none border border-border/40"
                  )}
                >
                  <span>{message.content}</span>
                  <span className={cn(
                    "block text-xs mt-1 text-right",
                    isOwnMessage(message) ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 p-4 border-t border-border/40"
      >
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <Paperclip className="w-5 h-5" />
        </Button>
        <Input
          ref={inputRef}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 h-11 rounded-[10px]"
        />
        <Button
          type="submit"
          variant="default"
          disabled={!newMessage.trim()}
          className="rounded-[10px] h-11 px-4"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </motion.div>
  );
};