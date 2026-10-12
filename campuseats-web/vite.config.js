import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local development only: the React app calls "/api/..." and Vite
// forwards it to the ASP.NET Core API on port 8080. In production there
// is no proxy – the app calls VITE_API_URL directly (see src/api/client.js).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
