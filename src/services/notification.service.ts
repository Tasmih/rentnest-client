import api from '@/lib/axios';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const notificationService = {
  /**
   * Fetch user notifications GET /api/notifications
   */
  async getNotifications(): Promise<GetNotificationsResponse> {
    const res = await api.get('/notifications');
    const rawData = res.data?.data || res.data;
    return {
      notifications: Array.isArray(rawData?.notifications) ? rawData.notifications : [],
      unreadCount: Number(rawData?.unreadCount || 0),
    };
  },

  /**
   * Mark notification as read PATCH /api/notifications/:id/read
   */
  async markAsRead(id: string): Promise<NotificationItem> {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data?.data || res.data;
  },

  /**
   * Mark all notifications as read PATCH /api/notifications/read-all
   */
  async markAllAsRead(): Promise<boolean> {
    await api.patch('/notifications/read-all');
    return true;
  },

  /**
   * Delete notification DELETE /api/notifications/:id
   */
  async deleteNotification(id: string): Promise<boolean> {
    await api.delete(`/notifications/${id}`);
    return true;
  },
};
