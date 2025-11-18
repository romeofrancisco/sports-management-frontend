import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { chatKeys } from './useChat';

export const useGlobalChatWebSocket = () => {
  const websocketRef = useRef(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    // Close existing connection
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    // Use environment variable for WebSocket URL
    const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    
    // Get access token from cookies for WebSocket authentication
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    const accessToken = getCookie('access_token');
    let wsUrl = `${wsBaseUrl}/ws/chat/global/`;
    
    // Add token and user ID as query parameters
    if (accessToken) {
      wsUrl += `?token=${encodeURIComponent(accessToken)}&user_id=${user.id}`;
    }
    
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chat_message') {
        // Create message object
        const newMessage = {
          id: data.message_id,
          message: data.message,
          sender_name: data.sender_name,
          sender_id: data.sender_id,
          sender_role: data.sender_role,
          profile: data.profile || {},
          timestamp: data.timestamp,
          is_read: false,
        };

        // Update team messages cache if the query exists (user might be viewing this team's chat)
        const teamMessagesKey = chatKeys.teamMessages(data.team_id);        const existingMessages = queryClient.getQueryData(teamMessagesKey);
        
        if (existingMessages) {
          queryClient.setQueryData(teamMessagesKey, (oldMessages) => {
            if (!oldMessages) return [newMessage];
            // Check if message already exists to prevent duplicates
            const exists = oldMessages.some(msg => msg.id === newMessage.id);
            if (exists) {
              return oldMessages;
            }
            return [...oldMessages, newMessage];
          });
        }

        // Always update team chats cache for unread count
        const isCurrentUserMessage = data.sender_id === user.id;
        queryClient.setQueryData(
          chatKeys.teamChats(),
          (oldChats) => {            if (!oldChats) return oldChats;
            
            return oldChats.map(chat => {
              if (chat.team_id === parseInt(data.team_id)) {
                return {
                  ...chat,
                  latest_message: {
                    sender_name: data.sender_name,
                    message: data.message,
                    timestamp: data.timestamp,
                  },
                  // Only increment unread count if message is NOT from current user
                  unread_count: isCurrentUserMessage 
                    ? chat.unread_count 
                    : chat.unread_count + 1,
                };
              }
              return chat;
            });
          }
        );

        // Show browser notification if document is hidden and message is not from current user
        // and user is not currently viewing this chat and notifications are enabled and team is not muted
        const isViewingThisChat = window.location.pathname.includes(`/chat/${data.team_id}`);
        const chatNotificationsEnabled = JSON.parse(localStorage.getItem('chatNotificationsEnabled') ?? 'true');
        const mutedTeams = JSON.parse(localStorage.getItem('mutedTeams') ?? '[]');
        const isTeamMuted = mutedTeams.includes(data.team_id.toString()) || mutedTeams.includes(parseInt(data.team_id));
        
        if (!isCurrentUserMessage && document.hidden && !isViewingThisChat && chatNotificationsEnabled && !isTeamMuted && 'Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(data.team_name || `Team ${data.team_id}`, {
            body: `${data.sender_name}: ${data.message.length > 80 ? data.message.substring(0, 80) + '...' : data.message}`,
            icon: '/perpetual_logo_small.png', // Use perpetual logo for notifications
            tag: `chat-${data.team_id}`, // Group notifications by team
          });

          // Auto-close notification after 5 seconds
          setTimeout(() => {
            notification.close();
          }, 5000);

          // Click handler to focus window and navigate to chat
          notification.onclick = () => {
            window.focus();
            window.location.href = `/chat/${data.team_id}`;
            notification.close();
          };
        }

        // Force React Query to notify all components about the change
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: chatKeys.teamChats(),
            refetchType: 'none'
          });
        }, 0);
      }    };
    
    ws.onclose = (event) => {
      // Attempt to reconnect if not a normal closure and user is still authenticated
      if (event.code !== 1000 && isAuthenticated && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };
    
    ws.onerror = (error) => {
      console.error('Global WebSocket error:', error);
    };
    
    ws.onopen = () => {
      // Reset reconnect attempts on successful connection
      reconnectAttemptsRef.current = 0;
    };
    
    websocketRef.current = ws;  }, [isAuthenticated, user?.id, queryClient]);

  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (websocketRef.current) {
      websocketRef.current.close(1000, 'User disconnecting');
      websocketRef.current = null;
    }
    
    reconnectAttemptsRef.current = 0;
  }, []);

  // Connect when user is authenticated, disconnect when not
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connectWebSocket();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return disconnect;
  }, [isAuthenticated, user?.id, connectWebSocket, disconnect]);

  return {
    isConnected: websocketRef.current?.readyState === WebSocket.OPEN,
    disconnect,
  };
};
