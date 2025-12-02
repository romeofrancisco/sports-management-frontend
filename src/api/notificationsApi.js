import api from "./index";

/**
 * Get notification logs for the authenticated user
 * @param {Object} params - Query parameters
 * @param {string} params.notification_type - Filter by type
 * @param {boolean} params.is_read - Filter by read status
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page
 */
export const getNotificationLogs = async (params = {}) => {
  const response = await api.get("/notifications/logs/", { params });
  return response.data;
};

/**
 * Mark a specific notification as read
 * @param {number} notificationId - The notification ID
 */
export const markNotificationRead = async (notificationId) => {
  const response = await api.post(`/notifications/logs/${notificationId}/read/`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await api.post("/notifications/logs/mark-all-read/");
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/logs/unread-count/");
  return response.data;
};

/**
 * Delete a specific notification
 * @param {number} notificationId - The notification ID
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/logs/${notificationId}/delete/`);
  return response.data;
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async () => {
  const response = await api.delete("/notifications/logs/delete-all/");
  return response.data;
};

export default {
  getNotificationLogs,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
};
