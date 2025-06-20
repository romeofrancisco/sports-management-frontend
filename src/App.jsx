import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useGlobalChatWebSocket } from "./hooks/useGlobalChatWebSocket";


const App = () => {
  // Initialize global chat WebSocket for real-time notifications
  useGlobalChatWebSocket();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
