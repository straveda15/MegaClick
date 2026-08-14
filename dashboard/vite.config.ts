import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Forward all /api calls to your backend
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      // Locally-uploaded images/videos are served by the backend at /media/...
      // (see Backend saveToDisk). Proxy them so they render in the dashboard.
      "/media": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "ws://127.0.0.1:5000",
        ws: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
