import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: { environment: "node" },
  resolve: {
    // Mirror the tsconfig "@/*" path alias so tests can import like the app.
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
