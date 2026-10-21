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
		profilePlugins: [
			{
				pluginId: "smoke-profile",
				pluginVersion: "1.0.0",
				pluginDigest: "smoke-digest",
				profiles: [
					{
						id: "reviewer",
						resolve: ({ params }) => ({
							systemPrompt: `focus=${params.focus}`,
						}),
					},
				],
			},
		],
	});
	const profile = { id: "reviewer", params: { focus: "security" } };
	const connection = await adapter.createAgent({
		runId: "new",
		cwd: root,
		capabilities: { tools: [], skills: [] },
		profile,
	});
	assert.ok(
		connection.sessionReference,
		"new SDK agent should persist a session reference",
	);
	assert.equal(connection.assembly?.profileId, "reviewer");
	await adapter.releaseAgent(connection);

	const resumedAdapter = new PiAgentIntegrationAdapter({
		cwd: root,
		sessionDir: join(root, "sessions"),
		profilePlugins: [
			{
				pluginId: "smoke-profile",
				pluginVersion: "1.0.0",
				pluginDigest: "smoke-digest",
				profiles: [
					{
						id: "reviewer",
						resolve: ({ params }) => ({
							systemPrompt: `focus=${params.focus}`,
						}),
					},
				],
			},
		],
	});
	const resumed = await resumedAdapter.takeOverAgent({
		runId: "resumed",
		agentReference: connection.sessionReference,
		cwd: root,
		expectedAssembly: connection.assembly,
		expectedProfile: profile,
	});
	assert.equal(resumed.platformReference, connection.sessionReference);
	await resumedAdapter.releaseAgent(resumed);
	console.log("Pi SDK session create and resume passed");
} finally {
	await rm(root, { recursive: true, force: true });
}
