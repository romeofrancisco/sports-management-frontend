import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getTeamChats,
  getTeamMessages,
  sendMessage,
  markMessagesAsRead,
  getBroadcastTeams,
  broadcastMessage,
} from "@/api/chatApi";

// Query keys for chat
export const chatKeys = {
  all: ["chat"],
  teamChats: () => [...chatKeys.all, "teams"],
  teamMessages: (teamId) => [...chatKeys.all, "messages", teamId],
};

// Hook to get all team chats
export const useTeamChats = () => {
  return useQuery({
    queryKey: chatKeys.teamChats(),
    queryFn: async () => {
      const response = await getTeamChats();
      return response.data || [];
    },    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    notifyOnChangeProps: "all",
  });
};

// Hook to get messages for a specific team
export const useTeamMessages = (teamId, enabled = true) => {
  return useQuery({
    queryKey: chatKeys.teamMessages(teamId),
    queryFn: async () => {
      const response = await getTeamMessages(teamId);
      return response.data?.results || [];
    },    enabled: enabled && !!teamId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
    },    onMutate: async ({ teamId, message }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: chatKeys.teamMessages(teamId),
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(
        chatKeys.teamMessages(teamId)
      );

      // Optimistic update
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        message,
        sender_name: "You",
        sender_id: null,
        sender_role: null,
        profile: {},
        timestamp: new Date().toISOString(),
        is_read: true,
      };

      queryClient.setQueryData(chatKeys.teamMessages(teamId), (oldData) => {
        if (!oldData || !oldData.pages) {
          return {
            pages: [
              {
                results: [optimisticMessage],
                next: null,
                previous: null,
                count: 1,
              },
            ],
            pageParams: [1],
          };
        }
        
        // Add new message to the first page
        const updatedPages = [...oldData.pages];
        if (updatedPages[0]) {
          updatedPages[0] = {
            ...updatedPages[0],
            results: [optimisticMessage, ...(updatedPages[0].results || [])],
            count: (updatedPages[0].count || 0) + 1,
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      return { previousData, optimisticMessage, teamId };
    },    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          chatKeys.teamMessages(context.teamId),
          context.previousData
        );
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic message with real one
      queryClient.setQueryData(
        chatKeys.teamMessages(variables.teamId),
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            results:
              page.results?.map((msg) =>
                msg.id === context?.optimisticMessage?.id ? data : msg
              ) || [],
          }));return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
  });
};

// Hook to mark messages as read (with proper safeguards)
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["markMessagesAsRead"],
    mutationFn: async (teamId) => {
      const response = await markMessagesAsRead(teamId);
      return response.data;    },
    onSuccess: (data, teamId) => {
      // Update cache with new unread count
      const updateTeamChats = (oldChats) => {
        if (!oldChats) return oldChats;
        return oldChats.map((chat) => {
          if (chat.team_id === teamId) {
            return {
              ...chat,
              unread_count: 0,
            };
          }
          return chat;
        });
      };

      queryClient.setQueryData(chatKeys.teamChats(), updateTeamChats);
      queryClient.setQueriesData(
        { queryKey: chatKeys.teamChats() },
        updateTeamChats
      );
    },
    onError: (error, teamId) => {
      // Handle error silently or with user-friendly notification
    },    retry: false,
    gcTime: 0,
  });
};

// Hook to get messages for a specific team with infinite scroll
export const useInfiniteTeamMessages = (teamId, enabled = true) => {
  return useInfiniteQuery({
    queryKey: chatKeys.teamMessages(teamId),    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTeamMessages(teamId, { page: pageParam });
      return response.data;
    },
    enabled: enabled && !!teamId,
    getNextPageParam: (lastPage) => {
      if (lastPage?.next) {
        try {
          // Handle both absolute and relative URLs
          let nextUrl;
          if (lastPage.next.startsWith("http")) {
            nextUrl = new URL(lastPage.next);
          } else {
            nextUrl = new URL(lastPage.next, window.location.origin);
          }
          const nextPage = nextUrl.searchParams.get("page");
          return parseInt(nextPage, 10);
        } catch (error) {
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};

// Hook to get teams available for broadcast
export const useBroadcastTeams = () => {
  return useQuery({
    queryKey: [...chatKeys.all, "broadcast-teams"],
    queryFn: async () => {
      const response = await getBroadcastTeams();
      return response.data;
    },
  });
};

// Hook to broadcast message to multiple teams
export const useBroadcastMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, teamIds, broadcastAll }) => {
      const response = await broadcastMessage({
        message,
        team_ids: teamIds,
        broadcast_all: broadcastAll,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate team chats to refresh latest messages
      queryClient.invalidateQueries({ queryKey: chatKeys.teamChats() });
      
      // Invalidate messages for each team that received the broadcast
      if (data.messages) {
        data.messages.forEach((msg) => {
          queryClient.invalidateQueries({
            queryKey: chatKeys.teamMessages(msg.team_id),
          });
        });
      }
    },
  });
};
