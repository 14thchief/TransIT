import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      components: "/src/components",
      src: "/src",
    },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "src/scss/variables" as *;` },
    },
  },
});
