import { SessionError } from "../types.js";
import { Session } from "../session.js";
import { uuidv7 } from "./uuid.js";
//#region packages/agent-core/src/harness/session/repo-utils.ts
function createSessionId() {
	return uuidv7();
}
function createTimestamp() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function toSession(storage) {
	return new Session(storage);
}
function getFileSystemResultOrThrow(result, message) {
	if (!result.ok) throw new SessionError(result.error.code === "not_found" ? "not_found" : "storage", `${message}: ${result.error.message}`, result.error);
	return result.value;
}
async function getEntriesToFork(storage, options) {
	if (!options.entryId) return storage.getEntries();
	const target = await storage.getEntry(options.entryId);
	if (!target) throw new SessionError("invalid_fork_target", `Entry ${options.entryId} not found`);
	let effectiveLeafId;
	if ((options.position ?? "before") === "at") effectiveLeafId = target.id;
	else {
		if (target.type !== "message" || target.message.role !== "user") throw new SessionError("invalid_fork_target", `Entry ${options.entryId} is not a user message`);
		effectiveLeafId = target.parentId;
	}
	return storage.getPathToRoot(effectiveLeafId);
}
//#endregion
export { createSessionId, createTimestamp, getEntriesToFork, getFileSystemResultOrThrow, toSession };
