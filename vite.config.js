import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Root index.html = current www portfolio (static).
// demo/index.html = apartment portfolio React app for demo.weihong.dev.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  server: {
    // @ts-expect-error TEMPO may be injected by Tempo tooling
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        demo: path.resolve(rootDir, "demo/index.html"),
      },
    },
  },
});
