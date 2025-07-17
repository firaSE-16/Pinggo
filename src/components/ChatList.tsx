'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, MoreVertical, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useChatList } from '@/hooks/useChatList';
import { ChatPartner } from '@/services/chatService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col h-full bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg",
          className
        )}
      >
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Chats</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-destructive text-lg font-semibold">{error}</p>
            </div>
            <Button 
              onClick={refresh} 
              variant="outline" 
              className="rounded-[10px] h-11 px-6"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
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
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Chats</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={isLoading}
            className="rounded-full h-10 w-10 hover:bg-primary/10"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-[10px] shadow-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center space-x-4 p-4 rounded-xl bg-muted/40"
              >
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center"
          >
            <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="text-muted-foreground text-base">
              {searchQuery 
                ? 'Try a different search term'
                : 'Start a conversation to see your chats here'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredPartners.map((partner) => {
              const isActive = pathname.includes(partner.id);
              const isOnline = onlineUsers.includes(partner.id);
              
              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handlePartnerClick(partner.id)}
                  className={cn(
                    "flex items-center p-4 rounded-xl cursor-pointer transition-all",
                    "hover:bg-primary/10 active:bg-primary/20",
                    isActive ? "bg-primary/10" : "bg-muted/20"
                  )}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative mr-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/30">
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
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold truncate">
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
                        <Badge 
                          variant="destructive" 
                          className="ml-2 h-5 w-5 flex items-center justify-center p-0"
                        >
                          {partner.unreadCount > 9 ? '9+' : partner.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* More options */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Add chat options menu
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};