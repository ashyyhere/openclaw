// QA Lab web Vite config builds the private debugger UI bundle.
import path from "node:path";
import { defineConfig } from "vite";

/** Default Vite config for the QA Lab web app. */
export default defineConfig({
  root: path.resolve(import.meta.dirname),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
});
