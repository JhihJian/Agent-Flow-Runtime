import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		reporters: ["dot"],
		silent: "passed-only",
		pool: "threads",
		poolOptions: { threads: { singleThread: true } },
	},
});
