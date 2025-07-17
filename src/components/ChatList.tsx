'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, MoreVertical, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useChatList } from '@/hooks/useChatList';
import { ChatPartner } from '@/services/chatService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ChatListProps {
  className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ className = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const { partners, isLoading, error, refresh, onlineUsers } = useChatList();

  const filteredPartners = partners.filter(partner =>
    partner.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastMessageTime = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    
    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else if (date.isAfter(now.subtract(7, 'day'))) {
      return date.format('ddd');
    } else {
      return date.format('MMM DD');
    }
  };

  const handlePartnerClick = (partnerId: string) => {
    router.push(`/chat/${partnerId}`);
  };

  if (error) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
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
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2 p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery 
                ? 'Try a different search term'
                : 'Start a conversation to see your chats here'
              }
            </p>
          </div>
        ) : (
          // Chat partners list
          <div className="space-y-1">
            {filteredPartners.map((partner) => {
              const isActive = pathname.includes(partner.id);
              const isOnline = onlineUsers.includes(partner.id);
              
              return (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner.id)}
                  className={`
                    flex items-center p-4 cursor-pointer transition-colors
                    hover:bg-muted/50 active:bg-muted
                    ${isActive ? 'bg-muted' : ''}
                  `}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative mr-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={partner.avatarUrl} />
                      <AvatarFallback>
                        {partner.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  {/* Chat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">
                        {partner.fullName || partner.username}
                      </h3>
                      {partner.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatLastMessageTime(partner.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {partner.lastMessage || 'No messages yet'}
                      </p>
                      {partner.unreadCount && partner.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {partner.unreadCount > 99 ? '99+' : partner.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* More options */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Add chat options menu
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 