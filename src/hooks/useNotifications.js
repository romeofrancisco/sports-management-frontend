import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationLogs,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notificationsApi";

export const NOTIFICATION_KEYS = {
  all: ["notifications"],
  logs: (params) => [...NOTIFICATION_KEYS.all, "logs", params],
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unreadCount"],
};

/**
 * Hook to fetch notification logs
 */
export const useNotificationLogs = (params = {}) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.logs(params),
    queryFn: () => getNotificationLogs(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

/**
 * Hook to fetch unread notification count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 30000,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

/**
 * Hook to delete all notifications
 */
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};
