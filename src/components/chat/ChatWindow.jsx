import React, { useEffect, useCallback, useState } from "react";
import { Bell, BellOff, MessageCircleMore } from "lucide-react";
import { useInfiniteTeamMessages } from "@/hooks/useChat";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useSendMessage } from "@/hooks/useChat";
import { useMarkAsReadHandler } from "@/hooks/useMarkAsReadHandler";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { toggleTeamMute as toggleTeamMuteInDB } from "@/utils/notificationSettings";

const ChatWindow = ({ selectedChat, currentUser }) => {

  const [mutedTeams, setMutedTeams] = useState(() => {
    const saved = localStorage.getItem("mutedTeams");
    const parsed = saved ? JSON.parse(saved) : [];
    // Ensure all IDs are strings for consistency
    return parsed.map(id => id.toString());
  });

  const toggleTeamMute = useCallback(async (teamId) => {
    // Update IndexedDB (for service worker) and localStorage (for UI)
    const result = await toggleTeamMuteInDB(teamId);
    setMutedTeams(result.mutedTeams);
  }, []);

  const isTeamMuted =
    selectedChat?.team_id && mutedTeams.includes(selectedChat.team_id.toString());

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteTeamMessages(selectedChat?.team_id, !!selectedChat);

  // Flatten all pages of messages
  const messages = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results || []);
  }, [data]);

  const sendMessageMutation = useSendMessage();
  const { markAsRead } = useMarkAsReadHandler();

  const { sendMessage: sendViaWebSocket } = useChatWebSocket(
    selectedChat?.team_id,
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

      // Try WebSocket first
      const sentViaWebSocket = sendViaWebSocket(message);

      if (!sentViaWebSocket) {
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
      <div className="lg:col-span-3 flex items-center justify-center h-full min-h-[400px] rounded-lg border">
        <div className="text-center">
          <MessageCircleMore className="size-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Select a team to start chatting</p>
          <p className="text-muted-foreground">
            Choose a team from the sidebar to view messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 lg:py-3 border-b-2 border-primary/20 rounded-t-lg">
        <div className="flex gap-2 items-center">
          <Avatar className="size-10 ring-2 ring-primary/20">
            <AvatarImage
              src={selectedChat.logo}
              alt={`${selectedChat.team_name} logo`}
            />
            <AvatarFallback>
              {selectedChat.team_name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">{selectedChat.team_name}</h2>
            <p className="text-xs text-muted-foreground">Team Chat</p>
          </div>
        </div>

    
          <Button
            variant="outline"
            size="icon"
            className={`bg-transparent ${
              isTeamMuted ? "text-muted-foreground" : ""
            }`}
            onClick={() => toggleTeamMute(selectedChat.team_id)}
            title={
              isTeamMuted
                ? "Unmute notifications for this team"
                : "Mute notifications for this team"
            }
          >
            {isTeamMuted ? <BellOff /> : <Bell />}
          </Button>
       
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading messages...
              </p>
            </div>
          </div>
        ) : (
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
      <div className="border-t-2 border-primary/20">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
