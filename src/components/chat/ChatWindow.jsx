import React, { useEffect, useCallback } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { useTeamMessages } from '@/hooks/useChat';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { useSendMessage } from '@/hooks/useChat';
import { useMarkAsReadHandler } from '@/hooks/useMarkAsReadHandler';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';

const ChatWindow = ({ selectedChat, currentUser }) => {
  const { data: messages = [], isLoading } = useTeamMessages(
    selectedChat?.team_id,
    !!selectedChat
  );
  
  const sendMessageMutation = useSendMessage();
  const { markAsRead } = useMarkAsReadHandler();
  
  // Use useCallback to memoize the onMessage handler
  const handleNewMessage = useCallback((newMessage) => {
    console.log('New message received via WebSocket:', newMessage);
  }, []);  const { sendMessage: sendViaWebSocket } = useChatWebSocket(
    selectedChat?.team_id,
    handleNewMessage,
    currentUser?.id
  );

  // Mark as read when user first opens the chat (debounced)
  useEffect(() => {
    if (selectedChat?.team_id) {
      markAsRead(selectedChat.team_id);
    }
  }, [selectedChat?.team_id, markAsRead]);  const handleSendMessage = useCallback(async (message) => {
    if (!selectedChat) return;

    // Try WebSocket first
    const sentViaWebSocket = sendViaWebSocket(message);
    
    if (!sentViaWebSocket) {
      // Fallback to API with optimistic updates
      console.log('Sending message via API fallback');
      sendMessageMutation.mutate({
        teamId: selectedChat.team_id,
        message
      });
    } else {
      console.log('Message sent via WebSocket');
    }
  }, [selectedChat, sendViaWebSocket, sendMessageMutation]);
  if (!selectedChat) {
    return (
      <div className="lg:col-span-3 flex items-center justify-center h-full min-h-[400px] bg-background rounded-lg border">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Select a team to start chatting</p>
          <p className="text-muted-foreground">Choose a team from the sidebar to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 flex flex-col h-full bg-background rounded-lg border overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {selectedChat.logo && (
          <img 
            src={selectedChat.logo} 
            alt={`${selectedChat.team_name} logo`}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{selectedChat.team_name}</h2>
          <p className="text-sm text-muted-foreground">Team Chat</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : (
          <MessagesList messages={messages} currentUser={currentUser} />
        )}
      </div>

      {/* Message Input */}
      <div className="border-t bg-background">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
