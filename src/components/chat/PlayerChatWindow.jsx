import React, { useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import { useInfiniteTeamMessages } from "@/hooks/useChat";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useSendMessage } from "@/hooks/useChat";
import { useMarkAsReadHandler } from "@/hooks/useMarkAsReadHandler";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";

const PlayerChatWindow = ({ selectedChat, currentUser }) => {
  const { 
    data, 
    isLoading, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
  } = useInfiniteTeamMessages(
    selectedChat?.team_id,
    !!selectedChat
  );

  // Flatten all pages of messages
  const messages = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.results || []);
  }, [data]);
  const sendMessageMutation = useSendMessage();
  const { markAsRead } = useMarkAsReadHandler();

  const { sendMessage: sendViaWebSocket } = useChatWebSocket(
    selectedChat?.team_id,
    undefined,
    currentUser?.id
  );

  // Mark as read when user first opens the chat (debounced)
  useEffect(() => {
    if (selectedChat?.team_id) {
      markAsRead(selectedChat.team_id);
    }
  }, [selectedChat?.team_id, markAsRead]);

  const handleSendMessage = useCallback(
    async (message) => {
      if (!selectedChat) return;
      // Try WebSocket first, fallback to API
      const sentViaWebSocket = sendViaWebSocket(message);

      if (!sentViaWebSocket) {
        // Fallback to API
        sendMessageMutation.mutate({
          teamId: selectedChat.team_id,
          message,
        });
      }
    },
    [selectedChat, sendViaWebSocket, sendMessageMutation]
  );
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No team chat available</p>
          <p className="text-muted-foreground">
            Your team chat will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {selectedChat.logo && (
          <img
            src={selectedChat.logo}
            alt={`${selectedChat.team_name} logo`}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{selectedChat.team_name}</h2>
          <p className="text-xs text-muted-foreground">Team Chat</p>
        </div>
      </div>

      {/* Messages Area - only this scrolls */}
      <div className="flex-grow h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading messages...
              </p>
            </div>
          </div>        ) : (
          <MessagesList 
            key={selectedChat?.team_id} // Reset component when switching chats
            messages={messages} 
            currentUser={currentUser}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-primary/20 bg-background">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PlayerChatWindow;
