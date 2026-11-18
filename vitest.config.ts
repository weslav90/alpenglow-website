import { defineConfig } from "vitest/config";

// Plain Node tests for data and config files. Kept separate from the Astro/Cloudflare build.
export default defineConfig({
	test: {
		include: ["tests/**/*.test.ts"],
		environment: "node",
	},
});
