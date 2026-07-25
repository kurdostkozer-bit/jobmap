import apiClient from '../../../core/api/apiClient';

export const notificationsAPI = {
  getNotifications: (unreadOnly = false) =>
    apiClient.get(`/notifications${unreadOnly ? '?unread=true' : ''}`),

  markAsRead: (notificationId) =>
    apiClient.patch(`/notifications/${notificationId}/read`),

  markAllAsRead: () => apiClient.patch('/notifications/read-all'),

  delete: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
};
