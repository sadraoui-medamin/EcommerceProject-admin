import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_API_URL?.replace(/\/$/, "");

  return {
    plugins: [react()],
    server: {
      proxy: backendUrl
        ? {
            "/api": {
              target: backendUrl,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  };
});
