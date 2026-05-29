import { SessionError } from "../types.js";
import { createSessionId, createTimestamp, getEntriesToFork, toSession } from "./repo-utils.js";
import { InMemorySessionStorage } from "./memory-storage.js";
//#region packages/agent-core/src/harness/session/memory-repo.ts
var InMemorySessionRepo = class {
	constructor() {
		this.sessions = /* @__PURE__ */ new Map();
	}
	async create(options = {}) {
		const metadata = {
			id: options.id ?? createSessionId(),
			createdAt: createTimestamp()
		};
		const session = toSession(new InMemorySessionStorage({ metadata }));
		this.sessions.set(metadata.id, session);
		return session;
	}
	async open(metadata) {
		const session = this.sessions.get(metadata.id);
		if (!session) throw new SessionError("not_found", `Session not found: ${metadata.id}`);
		return session;
	}
	async list() {
		return Promise.all([...this.sessions.values()].map((session) => session.getMetadata()));
	}
	async delete(metadata) {
		this.sessions.delete(metadata.id);
	}
	async fork(sourceMetadata, options) {
		const forkedEntries = await getEntriesToFork((await this.open(sourceMetadata)).getStorage(), options);
		const metadata = {
			id: options.id ?? createSessionId(),
			createdAt: createTimestamp()
		};
		const session = toSession(new InMemorySessionStorage({
			metadata,
			entries: forkedEntries
		}));
		this.sessions.set(metadata.id, session);
		return session;
	}
};
//#endregion
export { InMemorySessionRepo };
