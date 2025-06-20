import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useTeamChats } from "@/hooks/useChat";
import { TeamChatList, ChatWindow, PlayerChatWindow } from "@/components/chat";

const ChatPage = () => {
  const { teamId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { isPlayer } = useRolePermissions();

  const { data: teamChats = [], isLoading } = useTeamChats();

  // Find the selected chat based on URL param
  const selectedChat =
    teamChats.find((chat) => chat.team_id.toString() === teamId) ||
    (isPlayer() && teamChats.length > 0 ? teamChats[0] : null);
  // For players, show simplified single chat view
  if (isPlayer()) {
    return (
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Chat Window */}
        <div className="flex-1 bg-background/95 backdrop-blur-sm">
          <PlayerChatWindow selectedChat={selectedChat} currentUser={user} />
        </div>
      </div>
    );
  }
  // For admin/coach, show full chat interface with team list
  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Main Content */}
      <div className="flex-1">
        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-4">
          {/* Team List */}
          <div className="lg:col-span-1">
            <div className="h-[calc(100vh-4rem)] border-r-2 border-primary/20">
              <TeamChatList
                teamChats={teamChats}
                selectedChat={selectedChat}
                loading={isLoading}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <div className="h-[calc(100vh-4rem)] rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden">
              <ChatWindow selectedChat={selectedChat} currentUser={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
