import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import gameReducer from "./slices/gameSlice"
import playerStatReducer from "./slices/playerStatSlice"
import sportReducer from "./slices/sportSlice"
import chatReducer from "./slices/chatSlice"

const persistConfig = {
  key: "auth",
  storage,
    whitelist: ["user", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    game: gameReducer,
    playerStat: playerStatReducer,
    sport: sportReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE" ], // Ignore redux-persist actions
        ignoredPaths: ["register"], // Ignore problematic path
      },
    }),
});

export const persistor = persistStore(store);
export default store;
