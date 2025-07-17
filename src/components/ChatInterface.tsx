'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Mic, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@clerk/nextjs';
import { getOtherProfile } from '@/services/useOtherService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<any>(null);
  const [isLoadingPartner, setIsLoadingPartner] = useState(true);
  
  const partnerId = Array.isArray(id) ? id[0] : id;
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isTyping,
    unreadCount,
    markAsRead
  } = useChat({ partnerId: partnerId || '' });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load partner info
  useEffect(() => {
    if (!partnerId) return;
    
    const loadPartner = async () => {
      try {
        setIsLoadingPartner(true);
        const response = await getOtherProfile(partnerId);
        setPartner(response.data);
      } catch (err) {
        console.error('Failed to load partner:', err);
      } finally {
        setIsLoadingPartner(false);
      }
    };

    loadPartner();
  }, [partnerId]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;
    
    await sendMessage(newMessage.trim());
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

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return dayjs(timestamp).format('HH:mm');
  };

  // Check if message is from current user
  const isOwnMessage = (message: any) => {
    return message.senderId === currentUser?.id;
  };

  if (!partnerId) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Select a chat</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingPartner) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={partner?.avatarUrl} />
            <AvatarFallback>
              {partner?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium">
              {partner?.fullName || partner?.username}
            </h3>
            <p className="text-sm text-muted-foreground">
              {partner?.isOnline ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Online
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-muted-foreground text-sm">
              Send a message to {partner?.fullName || partner?.username} to begin chatting
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[70%] ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isOwnMessage(message) && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={partner?.avatarUrl} />
                      <AvatarFallback>
                        {partner?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col ${isOwnMessage(message) ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`
                        px-4 py-2 rounded-2xl max-w-full break-words
                        ${isOwnMessage(message)
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                        }
                      `}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={partner?.avatarUrl} />
                    <AvatarFallback>
                      {partner?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          
          {newMessage.trim() ? (
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}; 