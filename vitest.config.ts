import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		exclude: [
			"**/node_modules/**",
			"test/correctness.test.ts",
			"test/extension-session-replacement.test.ts",
			"test/flow-package.test.ts",
			"test/flow-reference.test.ts",
			"test/source-index.test.ts",
		],
		reporters: ["dot"],
		silent: "passed-only",
		pool: "threads",
		fileParallelism: false,
		maxWorkers: 1,
		minWorkers: 1,
	},
});
