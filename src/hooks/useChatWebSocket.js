import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "./useChat";

export const useChatWebSocket = (teamId, onMessage, currentUserId) => {
  const websocketRef = useRef(null);
  const queryClient = useQueryClient();
  const onMessageRef = useRef(onMessage);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Update the ref when onMessage changes to avoid stale closures
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  const connectWebSocket = useCallback(() => {
    if (!teamId) return;

    // Close existing connection
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // For development, connect to Django server on port 8000
    const backendHost =
      process.env.NODE_ENV === "production"
        ? window.location.host
        : "localhost:8000";

    // Get access token from cookies for WebSocket authentication
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const accessToken = getCookie("access_token");
    let wsUrl = `${wsProtocol}//${backendHost}/ws/chat/team/${teamId}/`;

    // Add token as query parameter if available
    if (accessToken) {
      wsUrl += `?token=${encodeURIComponent(accessToken)}`;
    }
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
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
        };        // Update React Query cache for infinite query structure
        queryClient.setQueryData(
          chatKeys.teamMessages(teamId),
          (oldData) => {
            if (!oldData || !oldData.pages) {
              // If no data exists, create initial structure
              return {
                pages: [{
                  results: [newMessage],
                  next: null,
                  previous: null,
                  count: 1
                }],
                pageParams: [1]
              };
            }

            // Check if message already exists to prevent duplicates
            const existsInAnyPage = oldData.pages.some(page => 
              page.results?.some(msg => msg.id === newMessage.id)
            );
            
            if (existsInAnyPage) {
              return oldData;
            }            // Add new message to the FIRST page (newest messages) since backend sends newest first
            const updatedPages = [...oldData.pages];
            if (updatedPages[0]) {
              updatedPages[0] = {
                ...updatedPages[0],
                results: [newMessage, ...(updatedPages[0].results || [])],
                count: (updatedPages[0].count || 0) + 1
              };
            }

            return {
              ...oldData,
              pages: updatedPages
            };
          }
        );

        // Note: Team chats cache updates are handled by global WebSocket to avoid conflicts
        // This WebSocket only handles team-specific message cache updates

        // Call custom onMessage callback if provided
        if (onMessageRef.current) {
          onMessageRef.current(newMessage);
        }
      }
    };

    ws.onclose = (event) => {
      // Attempt to reconnect if not a normal closure
      if (
        event.code !== 1000 &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
    };

    websocketRef.current = ws;
  }, [teamId, queryClient, currentUserId]); // Added currentUserId to dependencies
  const sendMessage = useCallback((message) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(JSON.stringify({ message }));
      return true;
    }
    return false;
  }, []);
  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close(1000, "Component unmounting"); // Normal closure
      websocketRef.current = null;
    }

    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return disconnect;
  }, [connectWebSocket, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: websocketRef.current?.readyState === WebSocket.OPEN,
  };
};
