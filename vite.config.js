import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force the ESM build of @emotion/is-prop-valid so Rollup doesn't leave a
      // runtime `require(...)` in the production bundle.
      "@emotion/is-prop-valid": path.resolve(
        __dirname,
        "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js"
      ),
    },
  },
  build: {
    // Ensure CommonJS deps are processed during the build so `require()` calls
    // inside packages are converted to ESM and bundled.
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    proxy: {
      // Proxy API requests from /api to your Django backend.
      // Do NOT rewrite - Django expects /api/ prefix
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "ws://127.0.0.1:8000",
        ws: true,
      },
    },
  },
});
