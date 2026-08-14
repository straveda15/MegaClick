import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Contact-form submissions go to the backend, which creates the lead that
      // shows up on the dashboard's Leads board. Proxying means the dev site
      // works with VITE_API_URL left blank, same as a same-origin deploy.
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});