import { uuidv7 } from "./uuid.js";
import { t as BaseSessionStorage } from "../../storage-base-D2ZcYOYx.js";
//#region packages/agent-core/src/harness/session/memory-storage.ts
var InMemorySessionStorage = class extends BaseSessionStorage {
	constructor(options) {
		super(options?.metadata ?? {
			id: uuidv7(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, options?.entries ? [...options.entries] : []);
	}
	async setLeafId(leafId) {
		this.recordEntry(this.createLeafEntry(leafId));
	}
	async appendEntry(entry) {
		this.recordEntry(entry);
	}
};
//#endregion
export { InMemorySessionStorage };
