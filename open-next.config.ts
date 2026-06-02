import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Explicitly tell opennextjs-cloudflare to run 'next build' directly.
  // Without this it calls 'pnpm run build' which loops back into itself.
  buildCommand: "npx next build",
});
