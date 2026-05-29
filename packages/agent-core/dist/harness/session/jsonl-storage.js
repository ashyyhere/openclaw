import { SessionError, toError } from "../types.js";
import { getFileSystemResultOrThrow } from "./repo-utils.js";
import { n as leafIdAfterEntry, t as BaseSessionStorage } from "../../storage-base-D2ZcYOYx.js";
//#region packages/agent-core/src/harness/session/jsonl-storage.ts
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function invalidSession(filePath, message, cause) {
	return new SessionError("invalid_session", `Invalid JSONL session file ${filePath}: ${message}`, cause);
}
function invalidEntry(filePath, lineNumber, message, cause) {
	return new SessionError("invalid_entry", `Invalid JSONL session file ${filePath}: line ${lineNumber} ${message}`, cause);
}
function parseHeaderLine(line, filePath) {
	let parsed;
	try {
		parsed = JSON.parse(line);
	} catch (error) {
		throw invalidSession(filePath, "first line is not a valid session header", toError(error));
	}
	if (!isRecord(parsed)) throw invalidSession(filePath, "first line is not a valid session header");
	if (parsed.type !== "session") throw invalidSession(filePath, "first line is not a valid session header");
	if (parsed.version !== 3) throw invalidSession(filePath, "unsupported session version");
	if (typeof parsed.id !== "string" || !parsed.id) throw invalidSession(filePath, "session header is missing id");
	if (typeof parsed.timestamp !== "string" || !parsed.timestamp) throw invalidSession(filePath, "session header is missing timestamp");
	if (typeof parsed.cwd !== "string" || !parsed.cwd) throw invalidSession(filePath, "session header is missing cwd");
	if (parsed.parentSession !== void 0 && typeof parsed.parentSession !== "string") throw invalidSession(filePath, "session header parentSession must be a string");
	return {
		type: "session",
		version: 3,
		id: parsed.id,
		timestamp: parsed.timestamp,
		cwd: parsed.cwd,
		parentSession: parsed.parentSession
	};
}
function parseEntryLine(line, filePath, lineNumber) {
	let parsed;
	try {
		parsed = JSON.parse(line);
	} catch (error) {
		throw invalidEntry(filePath, lineNumber, "is not valid JSON", toError(error));
	}
	if (!isRecord(parsed)) throw invalidEntry(filePath, lineNumber, "is not a valid session entry");
	if (typeof parsed.type !== "string") throw invalidEntry(filePath, lineNumber, "is missing entry type");
	if (typeof parsed.id !== "string" || !parsed.id) throw invalidEntry(filePath, lineNumber, "is missing entry id");
	if (parsed.parentId !== null && typeof parsed.parentId !== "string") throw invalidEntry(filePath, lineNumber, "has invalid parentId");
	if (typeof parsed.timestamp !== "string" || !parsed.timestamp) throw invalidEntry(filePath, lineNumber, "is missing timestamp");
	if (parsed.type === "leaf" && parsed.targetId !== null && typeof parsed.targetId !== "string") throw invalidEntry(filePath, lineNumber, "has invalid targetId");
	return parsed;
}
function headerToSessionMetadata(header, path) {
	return {
		id: header.id,
		createdAt: header.timestamp,
		cwd: header.cwd,
		path,
		parentSessionPath: header.parentSession
	};
}
async function loadJsonlSessionMetadata(fs, filePath) {
	const line = getFileSystemResultOrThrow(await fs.readTextLines(filePath, { maxLines: 1 }), `Failed to read session header ${filePath}`)[0];
	if (line?.trim()) return headerToSessionMetadata(parseHeaderLine(line, filePath), filePath);
	throw invalidSession(filePath, "missing session header");
}
async function loadJsonlStorage(fs, filePath) {
	const lines = getFileSystemResultOrThrow(await fs.readTextFile(filePath), `Failed to read session ${filePath}`).split("\n").filter((line) => line.trim());
	if (lines.length === 0) throw invalidSession(filePath, "missing session header");
	const header = parseHeaderLine(lines[0], filePath);
	const entries = [];
	let leafId = null;
	for (let i = 1; i < lines.length; i++) {
		const entry = parseEntryLine(lines[i], filePath, i + 1);
		entries.push(entry);
		leafId = leafIdAfterEntry(entry);
	}
	return {
		header,
		entries,
		leafId
	};
}
var JsonlSessionStorage = class JsonlSessionStorage extends BaseSessionStorage {
	constructor(fs, filePath, header, entries, leafId) {
		super(headerToSessionMetadata(header, filePath), entries, leafId);
		this.fs = fs;
		this.filePath = filePath;
	}
	static async open(fs, filePath) {
		const loaded = await loadJsonlStorage(fs, filePath);
		return new JsonlSessionStorage(fs, filePath, loaded.header, loaded.entries, loaded.leafId);
	}
	static async create(fs, filePath, options) {
		const header = {
			type: "session",
			version: 3,
			id: options.sessionId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			cwd: options.cwd,
			parentSession: options.parentSessionPath
		};
		getFileSystemResultOrThrow(await fs.writeFile(filePath, `${JSON.stringify(header)}\n`), `Failed to create session ${filePath}`);
		return new JsonlSessionStorage(fs, filePath, header, [], null);
	}
	async setLeafId(leafId) {
		const entry = this.createLeafEntry(leafId);
		getFileSystemResultOrThrow(await this.fs.appendFile(this.filePath, `${JSON.stringify(entry)}\n`), `Failed to append session leaf ${entry.id}`);
		this.recordEntry(entry);
	}
	async appendEntry(entry) {
		getFileSystemResultOrThrow(await this.fs.appendFile(this.filePath, `${JSON.stringify(entry)}\n`), `Failed to append session entry ${entry.id}`);
		this.recordEntry(entry);
	}
};
//#endregion
export { JsonlSessionStorage, loadJsonlSessionMetadata };
