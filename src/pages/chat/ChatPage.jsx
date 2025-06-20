import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { useTeamChats } from '@/hooks/useChat';
import { TeamChatList, ChatWindow, PlayerChatWindow } from '@/components/chat';
import UniversityPageHeader from '@/components/common/UniversityPageHeader';

const ChatPage = () => {
  const { teamId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { isPlayer } = useRolePermissions();
  
  const [selectedChat, setSelectedChat] = useState(null);
  
  const { data: teamChats = [], isLoading } = useTeamChats();
  // Handle team selection from URL or auto-select for players
  useEffect(() => {
    if (teamChats.length === 0 || selectedChat) return; // Don't change if already selected

    // If teamId is provided in URL, select that chat
    if (teamId) {
      const targetChat = teamChats.find(chat => chat.team_id.toString() === teamId);
      if (targetChat && (!selectedChat || selectedChat.team_id !== targetChat.team_id)) {
        setSelectedChat(targetChat);
      }
    } else if (isPlayer() && teamChats.length > 0) {
      // If no teamId and user is player, auto-select their team
      if (!selectedChat) {
        setSelectedChat(teamChats[0]);
      }    }
  }, [teamId, teamChats, isPlayer, selectedChat]);

  // For players, show simplified single chat view
  if (isPlayer()) {
    return (
      <div className="bg-gradient-to-br from-background via-primary/2 to-secondary/2">
          <PlayerChatWindow selectedChat={selectedChat} currentUser={user} />
      </div>
    );
  }

  // For admin/coach, show full chat interface with team list
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-0 md:p-4 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          <TeamChatList
            teamChats={teamChats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            loading={isLoading}
          />
          
          <ChatWindow selectedChat={selectedChat} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
