//#region packages/agent-core/src/harness/types.ts
/** Create a successful {@link Result}. */
function ok(value) {
	return {
		ok: true,
		value
	};
}
/** Create a failed {@link Result}. */
function err(error) {
	return {
		ok: false,
		error
	};
}
/** Return the success value or throw the failure error. Intended for tests and explicit adapter boundaries. */
function getOrThrow(result) {
	if (!result.ok) throw result.error;
	return result.value;
}
/** Return the success value or `undefined`. Only object values are allowed to avoid truthiness bugs with primitives. */
function getOrUndefined(result) {
	return result.ok ? result.value : void 0;
}
/** Normalize unknown thrown values into Error instances before using them as typed error causes. */
function toError(error) {
	if (error instanceof Error) return error;
	if (typeof error === "string") return new Error(error);
	try {
		return new Error(JSON.stringify(error));
	} catch {
		return new Error(String(error));
	}
}
/** Error returned by {@link FileSystem} file operations. */
var FileError = class extends Error {
	constructor(code, message, path, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "FileError";
		this.code = code;
		this.path = path;
	}
};
/** Error returned by {@link ExecutionEnv.exec}. */
var ExecutionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "ExecutionError";
		this.code = code;
	}
};
/** Error returned by compaction helpers. */
var CompactionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "CompactionError";
		this.code = code;
	}
};
/** Error returned by branch summarization helpers. */
var BranchSummaryError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BranchSummaryError";
		this.code = code;
	}
};
/** Error thrown by session storage, repositories, and session tree operations. */
var SessionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "SessionError";
		this.code = code;
	}
};
/** Public AgentHarness failure with a stable top-level classification. */
var AgentHarnessError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "AgentHarnessError";
		this.code = code;
	}
};
//#endregion
export { AgentHarnessError, BranchSummaryError, CompactionError, ExecutionError, FileError, SessionError, err, getOrThrow, getOrUndefined, ok, toError };
