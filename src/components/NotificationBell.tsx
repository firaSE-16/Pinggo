'use client';

import React, { useState } from 'react';
import { Bell, Settings, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/useNotifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotif,
    requestPermission 
  } = useNotifications();

  const formatNotificationTime = (timestamp: string) => {
    return dayjs(timestamp).fromNow();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_MESSAGE':
        return '💬';
      case 'POST_LIKE':
        return '❤️';
      case 'POST_COMMENT':
      case 'COMMENT_REPLY':
        return '💭';
      case 'NEW_FOLLOWER':
      case 'FOLLOW_REQUEST':
      case 'FOLLOW_ACCEPTED':
        return '👤';
      case 'POST_MENTION':
      case 'COMMENT_MENTION':
      case 'STORY_MENTION':
      case 'REEL_MENTION':
        return '@';
      case 'POST_SHARE':
      case 'REEL_SHARE':
        return '📤';
      case 'EVENT_INVITE':
      case 'EVENT_REMINDER':
        return '📅';
      default:
        return '🔔';
    }
  };

  const getNotificationTitle = (notification: any) => {
    switch (notification.type) {
      case 'NEW_MESSAGE':
        return 'New Message';
      case 'POST_LIKE':
        return 'Post Liked';
      case 'POST_COMMENT':
        return 'New Comment';
      case 'COMMENT_REPLY':
        return 'Comment Reply';
      case 'NEW_FOLLOWER':
        return 'New Follower';
      case 'FOLLOW_REQUEST':
        return 'Follow Request';
      case 'FOLLOW_ACCEPTED':
        return 'Follow Accepted';
      case 'POST_MENTION':
        return 'Post Mention';
      case 'COMMENT_MENTION':
        return 'Comment Mention';
      case 'POST_SHARE':
        return 'Post Shared';
      case 'REEL_SHARE':
        return 'Reel Shared';
      case 'EVENT_INVITE':
        return 'Event Invite';
      case 'EVENT_REMINDER':
        return 'Event Reminder';
      default:
        return 'Notification';
    }
  };

  const getNotificationMessage = (notification: any) => {
    const senderName = notification.reciverId?.fullName || notification.reciverId?.username || 'Someone';
    
    switch (notification.type) {
      case 'NEW_MESSAGE':
        return `${senderName} sent you a message`;
      case 'POST_LIKE':
        return `${senderName} liked your post`;
      case 'POST_COMMENT':
        return `${senderName} commented on your post`;
      case 'COMMENT_REPLY':
        return `${senderName} replied to your comment`;
      case 'NEW_FOLLOWER':
        return `${senderName} started following you`;
      case 'FOLLOW_REQUEST':
        return `${senderName} requested to follow you`;
      case 'FOLLOW_ACCEPTED':
        return `${senderName} accepted your follow request`;
      case 'POST_MENTION':
        return `${senderName} mentioned you in a post`;
      case 'COMMENT_MENTION':
        return `${senderName} mentioned you in a comment`;
      case 'POST_SHARE':
        return `${senderName} shared your post`;
      case 'REEL_SHARE':
        return `${senderName} shared your reel`;
      case 'EVENT_INVITE':
        return `${senderName} invited you to an event`;
      case 'EVENT_REMINDER':
        return `Reminder: You have an upcoming event`;
      default:
        return 'You have a new notification';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
    
    // TODO: Navigate to relevant page based on notification type
    // router.push(getNotificationLink(notification));
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Show success message or update UI
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRequestPermission}
              className="w-6 h-6"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">No notifications</h4>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    group flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors
                    border border-transparent hover:border-border shadow-sm
                    ${!notification.read ? 'bg-primary/5 border-primary/30' : 'bg-background'}
                  `}
                  onClick={() => handleNotificationClick(notification)}
                  tabIndex={0}
                  aria-label={getNotificationTitle(notification)}
                >
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    {notification.reciverId?.avatarUrl ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={notification.reciverId.avatarUrl} />
                        <AvatarFallback>
                          {notification.reciverId.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold truncate">
                        {getNotificationTitle(notification)}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotif(notification.id);
                        }}
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground mt-1 line-clamp-2">
                      {getNotificationMessage(notification)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full inline-block" aria-label="Unread" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}; 