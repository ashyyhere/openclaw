import { resolveAgentCoreCompleteFn } from "./runtime-deps.js";
import { CompactionError, err, ok } from "./harness/types.js";
import { convertToLlm, createBranchSummaryMessage, createCompactionSummaryMessage, createCustomMessage } from "./harness/messages.js";
import { buildSessionContext } from "./harness/session.js";
//#region packages/agent-core/src/harness/compaction/utils.ts
/** Create an empty file-operation accumulator. */
function createFileOps() {
	return {
		read: /* @__PURE__ */ new Set(),
		written: /* @__PURE__ */ new Set(),
		edited: /* @__PURE__ */ new Set()
	};
}
/** Add file operations from assistant tool calls to an accumulator. */
function extractFileOpsFromMessage(message, fileOps) {
	if (message.role !== "assistant") return;
	if (!("content" in message) || !Array.isArray(message.content)) return;
	for (const block of message.content) {
		if (typeof block !== "object" || block === null) continue;
		if (!("type" in block) || block.type !== "toolCall") continue;
		if (!("arguments" in block) || !("name" in block)) continue;
		const args = block.arguments;
		if (!args) continue;
		const path = typeof args.path === "string" ? args.path : void 0;
		if (!path) continue;
		switch (block.name) {
			case "read":
				fileOps.read.add(path);
				break;
			case "write":
				fileOps.written.add(path);
				break;
			case "edit":
				fileOps.edited.add(path);
				break;
		}
	}
}
/** Compute sorted read-only and modified file lists from accumulated operations. */
function computeFileLists(fileOps) {
	const modified = new Set([...fileOps.edited, ...fileOps.written]);
	return {
		readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
		modifiedFiles: [...modified].toSorted()
	};
}
/** Format file lists as summary metadata tags. */
function formatFileOperations(readFiles, modifiedFiles) {
	const sections = [];
	if (readFiles.length > 0) sections.push(`<read-files>\n${readFiles.join("\n")}\n</read-files>`);
	if (modifiedFiles.length > 0) sections.push(`<modified-files>\n${modifiedFiles.join("\n")}\n</modified-files>`);
	if (sections.length === 0) return "";
	return `\n\n${sections.join("\n\n")}`;
}
const TOOL_RESULT_MAX_CHARS = 2e3;
function safeJsonStringify$1(value) {
	try {
		return JSON.stringify(value) ?? "undefined";
	} catch {
		return "[unserializable]";
	}
}
function truncateForSummary(text, maxChars) {
	if (text.length <= maxChars) return text;
	const truncatedChars = text.length - maxChars;
	return `${text.slice(0, maxChars)}\n\n[... ${truncatedChars} more characters truncated]`;
}
/** Serialize LLM messages to plain text for summarization prompts. */
function serializeConversation(messages) {
	const parts = [];
	for (const msg of messages) if (msg.role === "user") {
		const content = typeof msg.content === "string" ? msg.content : msg.content.filter((c) => c.type === "text").map((c) => c.text).join("");
		if (content) parts.push(`[User]: ${content}`);
	} else if (msg.role === "assistant") {
		const textParts = [];
		const thinkingParts = [];
		const toolCalls = [];
		for (const block of msg.content) if (block.type === "text") textParts.push(block.text);
		else if (block.type === "thinking") thinkingParts.push(block.thinking);
		else if (block.type === "toolCall") {
			const args = block.arguments;
			const argsStr = Object.entries(args).map(([k, v]) => `${k}=${safeJsonStringify$1(v)}`).join(", ");
			toolCalls.push(`${block.name}(${argsStr})`);
		}
		if (thinkingParts.length > 0) parts.push(`[Assistant thinking]: ${thinkingParts.join("\n")}`);
		if (textParts.length > 0) parts.push(`[Assistant]: ${textParts.join("\n")}`);
		if (toolCalls.length > 0) parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
	} else if (msg.role === "toolResult") {
		const content = msg.content.filter((c) => c.type === "text").map((c) => c.text).join("");
		if (content) parts.push(`[Tool result]: ${truncateForSummary(content, TOOL_RESULT_MAX_CHARS)}`);
	}
	return parts.join("\n\n");
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.ts
function safeJsonStringify(value) {
	try {
		return JSON.stringify(value) ?? "undefined";
	} catch {
		return "[unserializable]";
	}
}
function extractFileOperations(messages, entries, prevCompactionIndex) {
	const fileOps = createFileOps();
	if (prevCompactionIndex >= 0) {
		const prevCompaction = entries[prevCompactionIndex];
		if (!prevCompaction.fromHook && prevCompaction.details) {
			const details = prevCompaction.details;
			if (Array.isArray(details.readFiles)) for (const f of details.readFiles) fileOps.read.add(f);
			if (Array.isArray(details.modifiedFiles)) for (const f of details.modifiedFiles) fileOps.edited.add(f);
		}
	}
	for (const msg of messages) extractFileOpsFromMessage(msg, fileOps);
	return fileOps;
}
function getMessageFromEntry(entry) {
	if (entry.type === "message") return entry.message;
	if (entry.type === "custom_message") return createCustomMessage(entry.customType, entry.content, entry.display, entry.details, entry.timestamp);
	if (entry.type === "branch_summary") return createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp);
	if (entry.type === "compaction") return createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp);
}
function getMessageFromEntryForCompaction(entry) {
	if (entry.type === "compaction") return;
	return getMessageFromEntry(entry);
}
/** Default compaction settings used by the harness. */
const DEFAULT_COMPACTION_SETTINGS = {
	enabled: true,
	reserveTokens: 16384,
	keepRecentTokens: 2e4
};
/** Calculate total context tokens from provider usage. */
function calculateContextTokens(usage) {
	return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
	if (msg.role === "assistant" && "usage" in msg) {
		const assistantMsg = msg;
		if (assistantMsg.stopReason !== "aborted" && assistantMsg.stopReason !== "error" && assistantMsg.usage) return assistantMsg.usage;
	}
}
/** Return usage from the last successful assistant message in session entries. */
function getLastAssistantUsage(entries) {
	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i];
		if (entry.type === "message") {
			const usage = getAssistantUsage(entry.message);
			if (usage) return usage;
		}
	}
}
function getLastAssistantUsageInfo(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const usage = getAssistantUsage(messages[i]);
		if (usage) return {
			usage,
			index: i
		};
	}
}
/** Estimate context tokens for messages using provider usage when available. */
function estimateContextTokens(messages) {
	const usageInfo = getLastAssistantUsageInfo(messages);
	if (!usageInfo) {
		let estimated = 0;
		for (const message of messages) estimated += estimateTokens(message);
		return {
			tokens: estimated,
			usageTokens: 0,
			trailingTokens: estimated,
			lastUsageIndex: null
		};
	}
	const usageTokens = calculateContextTokens(usageInfo.usage);
	let trailingTokens = 0;
	for (let i = usageInfo.index + 1; i < messages.length; i++) trailingTokens += estimateTokens(messages[i]);
	return {
		tokens: usageTokens + trailingTokens,
		usageTokens,
		trailingTokens,
		lastUsageIndex: usageInfo.index
	};
}
/** Return whether context usage exceeds the configured compaction threshold. */
function shouldCompact(contextTokens, contextWindow, settings) {
	if (!settings.enabled) return false;
	return contextTokens > contextWindow - settings.reserveTokens;
}
/** Estimate token count for one message using a conservative character heuristic. */
function estimateTokens(message) {
	let chars = 0;
	switch (message.role) {
		case "user": {
			const content = message.content;
			if (typeof content === "string") chars = content.length;
			else if (Array.isArray(content)) {
				for (const block of content) if (block.type === "text" && block.text) chars += block.text.length;
			}
			return Math.ceil(chars / 4);
		}
		case "assistant": {
			const assistant = message;
			for (const block of assistant.content) if (block.type === "text") chars += block.text.length;
			else if (block.type === "thinking") chars += block.thinking.length;
			else if (block.type === "toolCall") chars += block.name.length + safeJsonStringify(block.arguments).length;
			return Math.ceil(chars / 4);
		}
		case "custom":
		case "toolResult":
			if (typeof message.content === "string") chars = message.content.length;
			else for (const block of message.content) {
				if (block.type === "text" && block.text) chars += block.text.length;
				if (block.type === "image") chars += 4800;
			}
			return Math.ceil(chars / 4);
		case "bashExecution":
			chars = message.command.length + message.output.length;
			return Math.ceil(chars / 4);
		case "branchSummary":
		case "compactionSummary":
			chars = message.summary.length;
			return Math.ceil(chars / 4);
	}
	return 0;
}
function findValidCutPoints(entries, startIndex, endIndex) {
	const cutPoints = [];
	for (let i = startIndex; i < endIndex; i++) {
		const entry = entries[i];
		switch (entry.type) {
			case "message":
				switch (entry.message.role) {
					case "bashExecution":
					case "custom":
					case "branchSummary":
					case "compactionSummary":
					case "user":
					case "assistant":
						cutPoints.push(i);
						break;
					case "toolResult": break;
				}
				break;
			case "thinking_level_change":
			case "model_change":
			case "compaction":
			case "branch_summary":
			case "custom":
			case "custom_message":
			case "label":
			case "session_info":
			case "leaf": break;
		}
		if (entry.type === "branch_summary" || entry.type === "custom_message") cutPoints.push(i);
	}
	return cutPoints;
}
/** Find the user-visible message that starts the turn containing an entry. */
function findTurnStartIndex(entries, entryIndex, startIndex) {
	for (let i = entryIndex; i >= startIndex; i--) {
		const entry = entries[i];
		if (entry.type === "branch_summary" || entry.type === "custom_message") return i;
		if (entry.type === "message") {
			const role = entry.message.role;
			if (role === "user" || role === "bashExecution") return i;
		}
	}
	return -1;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens) {
	const cutPoints = findValidCutPoints(entries, startIndex, endIndex);
	if (cutPoints.length === 0) return {
		firstKeptEntryIndex: startIndex,
		turnStartIndex: -1,
		isSplitTurn: false
	};
	let accumulatedTokens = 0;
	let cutIndex = cutPoints[0];
	for (let i = endIndex - 1; i >= startIndex; i--) {
		const entry = entries[i];
		if (entry.type !== "message") continue;
		const messageTokens = estimateTokens(entry.message);
		accumulatedTokens += messageTokens;
		if (accumulatedTokens >= keepRecentTokens) {
			for (let c = 0; c < cutPoints.length; c++) if (cutPoints[c] >= i) {
				cutIndex = cutPoints[c];
				break;
			}
			break;
		}
	}
	while (cutIndex > startIndex) {
		const prevEntry = entries[cutIndex - 1];
		if (prevEntry.type === "compaction") break;
		if (prevEntry.type === "message") break;
		cutIndex--;
	}
	const cutEntry = entries[cutIndex];
	const isUserMessage = cutEntry.type === "message" && cutEntry.message.role === "user";
	const turnStartIndex = isUserMessage ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
	return {
		firstKeptEntryIndex: cutIndex,
		turnStartIndex,
		isSplitTurn: !isUserMessage && turnStartIndex !== -1
	};
}
const SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI coding assistant, then produce a structured summary following the exact format specified.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;
const SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
const UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
	const options = {
		maxTokens,
		signal,
		apiKey,
		headers
	};
	if (model.reasoning && thinkingLevel && thinkingLevel !== "off") options.reasoning = thinkingLevel;
	return options;
}
async function completeSummarization(model, context, options, streamFn, runtime) {
	if (streamFn) return (await streamFn(model, context, options)).result();
	return await resolveAgentCoreCompleteFn(runtime)(model, context, options);
}
/** Generate or update a conversation summary for compaction. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) {
	const maxTokens = Math.min(Math.floor(.8 * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	let basePrompt = previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT;
	if (customInstructions) basePrompt = `${basePrompt}\n\nAdditional focus: ${customInstructions}`;
	let promptText = `<conversation>\n${serializeConversation(convertToLlm(currentMessages))}\n</conversation>\n\n`;
	if (previousSummary) promptText += `<previous-summary>\n${previousSummary}\n</previous-summary>\n\n`;
	promptText += basePrompt;
	const response = await completeSummarization(model, {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: promptText
			}],
			timestamp: Date.now()
		}]
	}, createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel), streamFn, runtime);
	if (response.stopReason === "aborted") return err(new CompactionError("aborted", response.errorMessage || "Summarization aborted"));
	if (response.stopReason === "error") return err(new CompactionError("summarization_failed", `Summarization failed: ${response.errorMessage || "Unknown error"}`));
	return ok(response.content.filter((c) => c.type === "text").map((c) => c.text).join("\n"));
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
function prepareCompaction(pathEntries, settings) {
	if (pathEntries.length === 0 || pathEntries[pathEntries.length - 1].type === "compaction") return ok(void 0);
	let prevCompactionIndex = -1;
	for (let i = pathEntries.length - 1; i >= 0; i--) if (pathEntries[i].type === "compaction") {
		prevCompactionIndex = i;
		break;
	}
	let previousSummary;
	let boundaryStart = 0;
	if (prevCompactionIndex >= 0) {
		const prevCompaction = pathEntries[prevCompactionIndex];
		previousSummary = prevCompaction.summary;
		const firstKeptEntryIndex = pathEntries.findIndex((entry) => entry.id === prevCompaction.firstKeptEntryId);
		boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevCompactionIndex + 1;
	}
	const boundaryEnd = pathEntries.length;
	const tokensBefore = estimateContextTokens(buildSessionContext(pathEntries).messages).tokens;
	const cutPoint = findCutPoint(pathEntries, boundaryStart, boundaryEnd, settings.keepRecentTokens);
	const firstKeptEntry = pathEntries[cutPoint.firstKeptEntryIndex];
	if (!firstKeptEntry?.id) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const firstKeptEntryId = firstKeptEntry.id;
	const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
	const messagesToSummarize = [];
	for (let i = boundaryStart; i < historyEnd; i++) {
		const msg = getMessageFromEntryForCompaction(pathEntries[i]);
		if (msg) messagesToSummarize.push(msg);
	}
	const turnPrefixMessages = [];
	if (cutPoint.isSplitTurn) for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
		const msg = getMessageFromEntryForCompaction(pathEntries[i]);
		if (msg) turnPrefixMessages.push(msg);
	}
	const fileOps = extractFileOperations(messagesToSummarize, pathEntries, prevCompactionIndex);
	if (cutPoint.isSplitTurn) for (const msg of turnPrefixMessages) extractFileOpsFromMessage(msg, fileOps);
	return ok({
		firstKeptEntryId,
		messagesToSummarize,
		turnPrefixMessages,
		isSplitTurn: cutPoint.isSplitTurn,
		tokensBefore,
		previousSummary,
		fileOps,
		settings
	});
}
const TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
/** Generate compaction summary data from prepared session history. */
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, runtime) {
	const { firstKeptEntryId, messagesToSummarize, turnPrefixMessages, isSplitTurn, tokensBefore, previousSummary, fileOps, settings } = preparation;
	if (!firstKeptEntryId) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	let summary;
	if (isSplitTurn && turnPrefixMessages.length > 0) {
		const [historyResult, turnPrefixResult] = await Promise.all([messagesToSummarize.length > 0 ? generateSummary(messagesToSummarize, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) : Promise.resolve(ok("No prior history.")), generateTurnPrefixSummary(turnPrefixMessages, model, settings.reserveTokens, apiKey, headers, signal, thinkingLevel, streamFn, runtime)]);
		if (!historyResult.ok) return err(historyResult.error);
		if (!turnPrefixResult.ok) return err(turnPrefixResult.error);
		summary = `${historyResult.value}\n\n---\n\n**Turn Context (split turn):**\n\n${turnPrefixResult.value}`;
	} else {
		const summaryResult = await generateSummary(messagesToSummarize, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime);
		if (!summaryResult.ok) return err(summaryResult.error);
		summary = summaryResult.value;
	}
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary,
		firstKeptEntryId,
		tokensBefore,
		details: {
			readFiles,
			modifiedFiles
		}
	});
}
async function generateTurnPrefixSummary(messages, model, reserveTokens, apiKey, headers, signal, thinkingLevel, streamFn, runtime) {
	const maxTokens = Math.min(Math.floor(.5 * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	const response = await completeSummarization(model, {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: `<conversation>\n${serializeConversation(convertToLlm(messages))}\n</conversation>\n\n${TURN_PREFIX_SUMMARIZATION_PROMPT}`
			}],
			timestamp: Date.now()
		}]
	}, createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel), streamFn, runtime);
	if (response.stopReason === "aborted") return err(new CompactionError("aborted", response.errorMessage || "Turn prefix summarization aborted"));
	if (response.stopReason === "error") return err(new CompactionError("summarization_failed", `Turn prefix summarization failed: ${response.errorMessage || "Unknown error"}`));
	return ok(response.content.filter((c) => c.type === "text").map((c) => c.text).join("\n"));
}
//#endregion
export { serializeConversation as _, estimateContextTokens as a, findTurnStartIndex as c, prepareCompaction as d, shouldCompact as f, formatFileOperations as g, extractFileOpsFromMessage as h, compact as i, generateSummary as l, createFileOps as m, SUMMARIZATION_SYSTEM_PROMPT as n, estimateTokens as o, computeFileLists as p, calculateContextTokens as r, findCutPoint as s, DEFAULT_COMPACTION_SETTINGS as t, getLastAssistantUsage as u };
