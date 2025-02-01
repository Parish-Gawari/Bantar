import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: Defines local dev server port
  },
  build: {
    outDir: "dist", // Ensures Netlify picks the correct output folder
  },
  define: {
    "process.env": {}, // Fixes potential issues with process.env usage
  },
});
