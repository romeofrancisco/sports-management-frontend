import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { QueryProvider } from "./context/QueryProvider";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </StrictMode>
);
