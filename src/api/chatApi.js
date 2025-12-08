import api from ".";

// Get all team chats accessible by current user
export const getTeamChats = () => {
  return api.get('/chat/teams/');
};

// Get messages for a specific team chat
export const getTeamMessages = (teamId, params = {}) => {
  return api.get(`/chat/teams/${teamId}/messages/`, { params });
};

// Send a message to a team chat
export const sendMessage = (teamId, messageData) => {
  return api.post(`/chat/teams/${teamId}/messages/`, messageData);
};

// Mark messages as read for a team chat
export const markMessagesAsRead = (teamId) => {
  return api.post(`/chat/teams/${teamId}/mark-read/`);
};

// Create WebSocket connection for real-time chat
export const createChatWebSocket = (teamId, onMessage, onError) => {
  // Use environment variable for WebSocket URL
  const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  const wsUrl = `${wsBaseUrl}/ws/chat/team/${teamId}/`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log("Chat WebSocket connected for team:", teamId);
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };
  
  socket.onerror = (error) => {
    console.error("Chat WebSocket error:", error);
    if (onError) onError(error);
  };
  
  socket.onclose = () => {
    console.log("Chat WebSocket disconnected for team:", teamId);
  };
  
  return {
    socket,
    sendMessage: (message) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message }));
      }
    },
    close: () => socket.close()
  };
};

// Get teams available for broadcast
export const getBroadcastTeams = () => {
  return api.get('/chat/broadcast/');
};

// Broadcast message to multiple teams
export const broadcastMessage = (data) => {
  return api.post('/chat/broadcast/', data);
};

export default {
  getTeamChats,
  getTeamMessages,
  sendMessage,
  markMessagesAsRead,
  createChatWebSocket,
  getBroadcastTeams,
  broadcastMessage,
};
