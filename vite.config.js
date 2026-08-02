import { defineConfig } from "vite";

// Static HTML portfolio — design lives in index.html
export default defineConfig({
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
