import { SessionError } from "./harness/types.js";
import { uuidv7 } from "./harness/session/uuid.js";
//#region packages/agent-core/src/harness/session/storage-base.ts
function updateLabelCache(labelsById, entry) {
	if (entry.type !== "label") return;
	const label = entry.label?.trim();
	if (label) labelsById.set(entry.targetId, label);
	else labelsById.delete(entry.targetId);
}
function buildLabelsById(entries) {
	const labelsById = /* @__PURE__ */ new Map();
	for (const entry of entries) updateLabelCache(labelsById, entry);
	return labelsById;
}
function generateEntryId(byId) {
	for (let i = 0; i < 100; i++) {
		const id = uuidv7().slice(0, 8);
		if (!byId.has(id)) return id;
	}
	return uuidv7();
}
function leafIdAfterEntry(entry) {
	return entry.type === "leaf" ? entry.targetId : entry.id;
}
function resolveLeafId(entries) {
	let leafId = null;
	for (const entry of entries) leafId = leafIdAfterEntry(entry);
	return leafId;
}
var BaseSessionStorage = class {
	constructor(metadata, entries, leafId = resolveLeafId(entries)) {
		this.metadata = metadata;
		this.entries = entries;
		this.byId = new Map(entries.map((entry) => [entry.id, entry]));
		this.labelsById = buildLabelsById(entries);
		this.leafId = leafId;
		if (this.leafId !== null && !this.byId.has(this.leafId)) throw new SessionError("invalid_session", `Entry ${this.leafId} not found`);
	}
	async getMetadata() {
		return this.metadata;
	}
	async getLeafId() {
		if (this.leafId !== null && !this.byId.has(this.leafId)) throw new SessionError("invalid_session", `Entry ${this.leafId} not found`);
		return this.leafId;
	}
	createLeafEntry(leafId) {
		if (leafId !== null && !this.byId.has(leafId)) throw new SessionError("not_found", `Entry ${leafId} not found`);
		return {
			type: "leaf",
			id: generateEntryId(this.byId),
			parentId: this.leafId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: leafId
		};
	}
	async createEntryId() {
		return generateEntryId(this.byId);
	}
	recordEntry(entry) {
		this.entries.push(entry);
		this.byId.set(entry.id, entry);
		updateLabelCache(this.labelsById, entry);
		this.leafId = leafIdAfterEntry(entry);
	}
	async getEntry(id) {
		return this.byId.get(id);
	}
	async findEntries(type) {
		return this.entries.filter((entry) => entry.type === type);
	}
	async getLabel(id) {
		return this.labelsById.get(id);
	}
	async getPathToRoot(leafId) {
		if (leafId === null) return [];
		const path = [];
		let current = this.byId.get(leafId);
		if (!current) throw new SessionError("not_found", `Entry ${leafId} not found`);
		while (current) {
			path.unshift(current);
			if (!current.parentId) break;
			const parent = this.byId.get(current.parentId);
			if (!parent) throw new SessionError("invalid_session", `Entry ${current.parentId} not found`);
			current = parent;
		}
		return path;
	}
	async getEntries() {
		return [...this.entries];
	}
};
//#endregion
export { leafIdAfterEntry as n, BaseSessionStorage as t };
