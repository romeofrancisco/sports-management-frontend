import { useCallback, useRef } from 'react';
import { useMarkMessagesAsRead } from './useChat';

export const useMarkAsReadHandler = () => {
  const markAsReadMutation = useMarkMessagesAsRead();
  const lastMarkedRef = useRef(new Map()); // Track last marked time for each team
  const timeoutRef = useRef(new Map()); // Track pending timeouts

  const markAsRead = useCallback((teamId) => {
    if (!teamId || markAsReadMutation.isPending) return;
    
    const now = Date.now();
    const lastMarked = lastMarkedRef.current.get(teamId) || 0;
    
    // Only mark as read if it's been more than 10 seconds since last mark
    if (now - lastMarked < 10000) {
      return;
    }

    // Clear any existing timeout for this team
    const existingTimeout = timeoutRef.current.get(teamId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set a new timeout to debounce the mark as read call
    const timeoutId = setTimeout(() => {
      lastMarkedRef.current.set(teamId, Date.now());
      markAsReadMutation.mutate(teamId);
      timeoutRef.current.delete(teamId);
    }, 2000); // 2 second delay

    timeoutRef.current.set(teamId, timeoutId);
  }, [markAsReadMutation]);

  const markAsReadImmediate = useCallback((teamId) => {
    if (!teamId || markAsReadMutation.isPending) return;
    
    // Clear any pending timeout
    const existingTimeout = timeoutRef.current.get(teamId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutRef.current.delete(teamId);
    }

    const now = Date.now();
    const lastMarked = lastMarkedRef.current.get(teamId) || 0;
    
    // Only proceed if it's been more than 5 seconds since last mark
    if (now - lastMarked > 5000) {
      lastMarkedRef.current.set(teamId, now);
      markAsReadMutation.mutate(teamId);
    }
  }, [markAsReadMutation]);

  return {
    markAsRead,
    markAsReadImmediate,
    isMarking: markAsReadMutation.isPending,
  };
};
