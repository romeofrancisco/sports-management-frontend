import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTeamId: null,
  onlineUsers: [],
  notifications: [],
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedTeam: (state, action) => {
      state.selectedTeamId = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setSelectedTeam,
  setOnlineUsers,
  addNotification,
  removeNotification,
  clearNotifications,
  setConnectionStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
