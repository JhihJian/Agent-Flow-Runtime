import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PiAgentIntegrationAdapter } from "../dist/pi.js";

const root = await mkdtemp(join(tmpdir(), "flow-sdk-"));
try {
	const adapter = new PiAgentIntegrationAdapter({
		cwd: root,
		sessionDir: join(root, "sessions"),
	});
	const connection = await adapter.createAgent({ runId: "new", cwd: root });
	assert.ok(
		connection.sessionReference,
		"new SDK agent should persist a session reference",
	);
	await adapter.releaseAgent(connection);

	const resumedAdapter = new PiAgentIntegrationAdapter({
		cwd: root,
		sessionDir: join(root, "sessions"),
	});
	const resumed = await resumedAdapter.takeOverAgent({
		runId: "resumed",
		agentReference: connection.sessionReference,
		cwd: root,
	});
	assert.equal(resumed.platformReference, connection.sessionReference);
	await resumedAdapter.releaseAgent(resumed);
	console.log("Pi SDK session create and resume passed");
} finally {
	await rm(root, { recursive: true, force: true });
}
