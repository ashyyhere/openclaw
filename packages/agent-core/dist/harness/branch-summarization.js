import { resolveAgentCoreCompleteFn } from "../runtime-deps.js";
import { BranchSummaryError, err, ok } from "./types.js";
import { convertToLlm, createBranchSummaryMessage, createCompactionSummaryMessage, createCustomMessage } from "./messages.js";
import { _ as serializeConversation, g as formatFileOperations, h as extractFileOpsFromMessage, m as createFileOps, n as SUMMARIZATION_SYSTEM_PROMPT, o as estimateTokens, p as computeFileLists } from "../compaction-Bekq8-_P.js";
//#region packages/agent-core/src/harness/compaction/branch-summarization.ts
/** Collect entries that should be summarized before navigating to a different session tree entry. */
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
	const oldPath = new Set(oldBranch.map((entry) => entry.id));
	let commonAncestorId = null;
	for (let i = targetBranch.length - 1; i >= 0; i--) if (oldPath.has(targetBranch[i].id)) {
		commonAncestorId = targetBranch[i].id;
		break;
	}
	const firstSummarizedIndex = commonAncestorId === null ? 0 : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
	return {
		entries: oldBranch.slice(firstSummarizedIndex),
		commonAncestorId
	};
}
/** Collect entries that should be summarized before navigating to a different session tree entry. */
async function collectEntriesForBranchSummary(session, oldLeafId, targetId) {
	if (!oldLeafId) return {
		entries: [],
		commonAncestorId: null
	};
	return collectEntriesForBranchSummaryFromBranches(await session.getBranch(oldLeafId), await session.getBranch(targetId));
}
function getMessageFromEntry(entry) {
	switch (entry.type) {
		case "message":
			if (entry.message.role === "toolResult") return;
			return entry.message;
		case "custom_message": return createCustomMessage(entry.customType, entry.content, entry.display, entry.details, entry.timestamp);
		case "branch_summary": return createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp);
		case "compaction": return createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp);
		case "thinking_level_change":
		case "model_change":
		case "custom":
		case "label":
		case "session_info":
		case "leaf": return;
	}
}
/** Prepare branch entries for summarization within an optional token budget. */
function prepareBranchEntries(entries, tokenBudget = 0) {
	const messages = [];
	const fileOps = createFileOps();
	let totalTokens = 0;
	for (const entry of entries) if (entry.type === "branch_summary" && !entry.fromHook && entry.details) {
		const details = entry.details;
		if (Array.isArray(details.readFiles)) for (const f of details.readFiles) fileOps.read.add(f);
		if (Array.isArray(details.modifiedFiles)) for (const f of details.modifiedFiles) fileOps.edited.add(f);
	}
	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i];
		const message = getMessageFromEntry(entry);
		if (!message) continue;
		extractFileOpsFromMessage(message, fileOps);
		const tokens = estimateTokens(message);
		if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) {
			if (entry.type === "compaction" || entry.type === "branch_summary") {
				if (totalTokens < tokenBudget * .9) {
					messages.unshift(message);
					totalTokens += tokens;
				}
			}
			break;
		}
		messages.unshift(message);
		totalTokens += tokens;
	}
	return {
		messages,
		fileOps,
		totalTokens
	};
}
const BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
const BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate a summary for abandoned branch entries. */
async function generateBranchSummary(entries, options) {
	const { model, apiKey, headers, signal, customInstructions, replaceInstructions, reserveTokens = 16384 } = options;
	const { messages, fileOps } = prepareBranchEntries(entries, (model.contextWindow || 128e3) - reserveTokens);
	if (messages.length === 0) return ok({
		summary: "No content to summarize",
		readFiles: [],
		modifiedFiles: []
	});
	const conversationText = serializeConversation(convertToLlm(messages));
	let instructions;
	if (replaceInstructions && customInstructions) instructions = customInstructions;
	else if (customInstructions) instructions = `${BRANCH_SUMMARY_PROMPT}\n\nAdditional focus: ${customInstructions}`;
	else instructions = BRANCH_SUMMARY_PROMPT;
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: `<conversation>\n${conversationText}\n</conversation>\n\n${instructions}`
			}],
			timestamp: Date.now()
		}]
	};
	const streamOptions = {
		apiKey,
		headers,
		signal,
		maxTokens: 2048
	};
	const response = options.streamFn ? await (await options.streamFn(model, context, streamOptions)).result() : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
	if (response.stopReason === "aborted") return err(new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted"));
	if (response.stopReason === "error") return err(new BranchSummaryError("summarization_failed", `Branch summary failed: ${response.errorMessage || "Unknown error"}`));
	let summary = response.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
	summary = BRANCH_SUMMARY_PREAMBLE + summary;
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary: summary || "No summary generated",
		readFiles,
		modifiedFiles
	});
}
//#endregion
export { collectEntriesForBranchSummary, collectEntriesForBranchSummaryFromBranches, generateBranchSummary, prepareBranchEntries };
