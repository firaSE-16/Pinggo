import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { 
  Notification, 
  NotificationSettings,
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  requestNotificationPermission,
  showChatNotification,
  showLikeNotification,
  showCommentNotification,
  showFollowNotification
} from '@/services/notificationService';

interface UseNotificationsReturn {
  notifications: Notification[];
  settings: NotificationSettings | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotif: (notificationId: string) => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  refresh: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user: currentUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const [fetchedNotifications, fetchedSettings] = await Promise.all([
        fetchNotifications(),
        getNotificationSettings() // Now returns local defaults
      ]);
      setNotifications(fetchedNotifications);
      setSettings(fetchedSettings);
    } catch (err) {
      // Silently log error, do not block UI
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  const handleDeleteNotification = useCallback(async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  const handleUpdateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = await updateNotificationSettings(newSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to update notification settings:', err);
    }
  }, []);

  const handleRequestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    if (granted && settings) {
      await handleUpdateSettings({ pushNotifications: true });
    }
    return granted;
  }, [settings, handleUpdateSettings]);

  // Socket connection for real-time notifications
  useEffect(() => {
    if (!currentUser?.id) return;

    connectSocket(currentUser.id);

    // Listen for new notifications
    const handleNewNotification = (data: any) => {
      const newNotification: Notification = {
        id: data.id || Math.random().toString(36).substr(2, 9),
        type: data.type,
        read: false,
        createdAt: data.timestamp || new Date().toISOString(),
        postId: data.postId,
        commentId: data.commentId,
        senderId: data.senderId,
        reiverId: currentUser.id,
        reciverId: data.sender ? {
          id: data.sender.id,
          username: data.sender.username,
          fullName: data.sender.fullName,
          avatarUrl: data.sender.avatarUrl,
        } : undefined,
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show browser notification if enabled
      if (settings?.pushNotifications && data.type === 'NEW_MESSAGE') {
        showChatNotification(data.senderName || 'Someone', data.message);
      } else if (settings?.pushNotifications && data.type === 'POST_LIKE') {
        showLikeNotification(data.userName || 'Someone', 'post');
      } else if (settings?.pushNotifications && data.type === 'POST_COMMENT') {
        showCommentNotification(data.userName || 'Someone', data.comment || '');
      } else if (settings?.pushNotifications && data.type === 'NEW_FOLLOWER') {
        showFollowNotification(data.userName || 'Someone');
      }
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
      disconnectSocket();
    };
  }, [currentUser?.id, settings?.pushNotifications]);

  // Load notifications when user changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    settings,
    unreadCount,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotif: handleDeleteNotification,
    updateSettings: handleUpdateSettings,
    requestPermission: handleRequestPermission,
    refresh: loadNotifications,
  };
}; 