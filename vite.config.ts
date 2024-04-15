import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/", replacement: "/src/" },
      { find: "custom/", replacement: "/src/hooks/custom/" },
      { find: "reducers/", replacement: "/src/store/reducers/" },
    ],
  },
});
