import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamChats, getTeamMessages, sendMessage, markMessagesAsRead } from '@/api/chatApi';

// Query keys for chat
export const chatKeys = {
  all: ['chat'],
  teamChats: () => [...chatKeys.all, 'teams'],
  teamMessages: (teamId) => [...chatKeys.all, 'messages', teamId],
};

// Hook to get all team chats
export const useTeamChats = () => {
  return useQuery({
    queryKey: chatKeys.teamChats(),
    queryFn: async () => {
      const response = await getTeamChats();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Allow initial fetch on mount
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    notifyOnChangeProps: 'all', // Notify on all prop changes
  });
};

// Hook to get messages for a specific team
export const useTeamMessages = (teamId, enabled = true) => {
  return useQuery({
    queryKey: chatKeys.teamMessages(teamId),
    queryFn: async () => {
      const response = await getTeamMessages(teamId);
      return response.data?.results || [];
    },
    enabled: enabled && !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Allow initial fetch on mount
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

// Hook to send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, message }) => {
      const response = await sendMessage(teamId, { message });
      return response.data;
    },
    onMutate: async ({ teamId, message }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: chatKeys.teamMessages(teamId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(chatKeys.teamMessages(teamId));

      // Optimistically update to the new value
      const optimisticMessage = {
        id: `temp-${Date.now()}`, // Temporary ID
        message,
        sender_name: 'You', // Will be updated when real response comes
        sender_id: null, // Will be updated
        sender_role: null, // Will be updated
        profile: {},
        timestamp: new Date().toISOString(),
        is_read: true,
      };

      queryClient.setQueryData(chatKeys.teamMessages(teamId), (old) => {
        return old ? [...old, optimisticMessage] : [optimisticMessage];
      });

      // Return a context object with the snapshotted value
      return { previousMessages, optimisticMessage, teamId };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.teamMessages(context.teamId), context.previousMessages);
      }
      console.error('Failed to send message:', err);
    },
    onSuccess: (data, variables, context) => {
      // Replace the optimistic message with the real one
      queryClient.setQueryData(chatKeys.teamMessages(variables.teamId), (old) => {
        if (!old) return [data];
        
        // Find and replace the optimistic message
        return old.map(msg => 
          msg.id === context?.optimisticMessage?.id ? data : msg
        );
      });
      console.log('Message sent successfully via API');
    },
  });
};

// Hook to mark messages as read (with proper safeguards)
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['markMessagesAsRead'], // Add mutation key for deduplication
    mutationFn: async (teamId) => {
      const response = await markMessagesAsRead(teamId);
      return response.data;
    },    onSuccess: (data, teamId) => {
      console.log(`✅ Messages marked as read for team ${teamId}`);
      
      // Update cache with new unread count and force notification
      const updateTeamChats = (oldChats) => {
        if (!oldChats) return oldChats;
        return oldChats.map(chat => {
          if (chat.team_id === teamId) {
            const updatedChat = {
              ...chat,
              unread_count: 0, // Reset unread count
            };
            console.log(`📊 Reset unread count for team ${teamId}:`, updatedChat);
            return updatedChat;
          }
          return chat;
        });
      };

      // Update the data and ensure all observers are notified
      queryClient.setQueryData(chatKeys.teamChats(), updateTeamChats);
      queryClient.setQueriesData(
        { queryKey: chatKeys.teamChats() },
        updateTeamChats
      );
    },
    onError: (error, teamId) => {
      console.error('Failed to mark messages as read:', error);
    },
    // Prevent duplicate mutations
    retry: false,
    gcTime: 0, // Don't cache mutation results
  });
};
