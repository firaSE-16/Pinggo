import { api } from "@/lib/api";

export interface Notification {
  id: string;
  type: "POST_LIKE" | "POST_COMMENT" | "COMMENT_REPLY" | "POST_MENTION" | "COMMENT_MENTION" | "STORY_MENTION" | "REEL_MENTION" | "FOLLOW_REQUEST" | "FOLLOW_ACCEPTED" | "NEW_FOLLOWER" | "NEW_MESSAGE" | "MESSAGE_REQUEST" | "POST_SHARE" | "REEL_SHARE" | "STORY_REPLY" | "EVENT_INVITE" | "EVENT_REMINDER" | "VERIFICATION_ALERT" | "ACCOUNT_WARNING" | "SECURITY_ALERT" | "NEW_FEATURE" | "SYSTEM_UPDATE";
  read: boolean;
  createdAt: string;
  postId?: string;
  commentId?: string;
  senderId?: string;
  reiverId: string;
  reciverId?: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export interface NotificationSettings {
  userId: string;
  messageNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  followNotifications: boolean;
  mentionNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const res = await api.get('/notifications');
    return res.data.data || [];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw new Error('Failed to load notifications');
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await api.put('/notifications/read-all');
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const res = await api.get('/notifications/settings');
    return res.data.data;
  } catch (error) {
    console.error('Failed to fetch notification settings:', error);
    throw new Error('Failed to load notification settings');
  }
};

export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  try {
    const res = await api.put('/notifications/settings', settings);
    return res.data.data;
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    throw new Error('Failed to update notification settings');
  }
};

// Browser notification helpers
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
};

export const showChatNotification = (senderName: string, message: string): void => {
  showNotification(`New message from ${senderName}`, {
    body: message,
    tag: 'chat-message',
    requireInteraction: false,
    silent: false,
  });
};

export const showLikeNotification = (userName: string, postType: string): void => {
  showNotification(`${userName} liked your ${postType}`, {
    body: 'Tap to view',
    tag: 'like',
    requireInteraction: false,
    silent: false,
  });
};

export const showCommentNotification = (userName: string, comment: string): void => {
  showNotification(`${userName} commented on your post`, {
    body: comment,
    tag: 'comment',
    requireInteraction: false,
    silent: false,
  });
};

export const showFollowNotification = (userName: string): void => {
  showNotification(`${userName} started following you`, {
    body: 'Tap to view their profile',
    tag: 'follow',
    requireInteraction: false,
    silent: false,
  });
};
