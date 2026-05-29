//#region packages/agent-core/src/harness/utils/truncate.ts
/**
* Shared truncation utilities for tool outputs.
*
* Truncation is based on two independent limits - whichever is hit first wins:
* - Line limit (default: 2000 lines)
* - Byte limit (default: 50KB)
*
* Never returns partial lines (except bash tail truncation edge case).
*/
const DEFAULT_MAX_LINES = 2e3;
const DEFAULT_MAX_BYTES = 50 * 1024;
const GREP_MAX_LINE_LENGTH = 500;
const runtimeBuffer = globalThis.Buffer;
function findFirstNonAscii(content) {
	for (let index = 0; index < content.length; index++) if (content.charCodeAt(index) > 127) return index;
	return -1;
}
function utf8ByteLength(content) {
	if (runtimeBuffer) return runtimeBuffer.byteLength(content, "utf8");
	const firstNonAscii = findFirstNonAscii(content);
	if (firstNonAscii === -1) return content.length;
	let bytes = firstNonAscii;
	for (let i = firstNonAscii; i < content.length; i++) {
		const code = content.charCodeAt(i);
		if (code <= 127) bytes += 1;
		else if (code <= 2047) bytes += 2;
		else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
			const next = content.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				bytes += 4;
				i++;
			} else bytes += 3;
		} else bytes += 3;
	}
	return bytes;
}
function replaceUnpairedSurrogates(content) {
	let output = "";
	for (let i = 0; i < content.length; i++) {
		const code = content.charCodeAt(i);
		if (code >= 55296 && code <= 56319) {
			if (i + 1 < content.length) {
				const next = content.charCodeAt(i + 1);
				if (next >= 56320 && next <= 57343) {
					output += content[i] + content[i + 1];
					i++;
					continue;
				}
			}
			output += "�";
		} else if (code >= 56320 && code <= 57343) output += "�";
		else output += content[i];
	}
	return output;
}
/**
* Format bytes as human-readable size.
*/
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes}B`;
	else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
/**
* Truncate content from the head (keep first N lines/bytes).
* Suitable for file reads where you want to see the beginning.
*
* Never returns partial lines. If first line exceeds byte limit,
* returns empty content with firstLineExceedsLimit=true.
*/
function truncateHead(content, options = {}) {
	const maxLines = options.maxLines ?? 2e3;
	const maxBytes = options.maxBytes ?? 51200;
	const totalBytes = utf8ByteLength(content);
	const lines = content.split("\n");
	const totalLines = lines.length;
	if (totalLines <= maxLines && totalBytes <= maxBytes) return {
		content,
		truncated: false,
		truncatedBy: null,
		totalLines,
		totalBytes,
		outputLines: totalLines,
		outputBytes: totalBytes,
		lastLinePartial: false,
		firstLineExceedsLimit: false,
		maxLines,
		maxBytes
	};
	if (utf8ByteLength(lines[0]) > maxBytes) return {
		content: "",
		truncated: true,
		truncatedBy: "bytes",
		totalLines,
		totalBytes,
		outputLines: 0,
		outputBytes: 0,
		lastLinePartial: false,
		firstLineExceedsLimit: true,
		maxLines,
		maxBytes
	};
	const outputLinesArr = [];
	let outputBytesCount = 0;
	let truncatedBy = "lines";
	for (let i = 0; i < lines.length && i < maxLines; i++) {
		const line = lines[i];
		const lineBytes = utf8ByteLength(line) + (i > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > maxBytes) {
			truncatedBy = "bytes";
			break;
		}
		outputLinesArr.push(line);
		outputBytesCount += lineBytes;
	}
	if (outputLinesArr.length >= maxLines && outputBytesCount <= maxBytes) truncatedBy = "lines";
	const outputContent = outputLinesArr.join("\n");
	const finalOutputBytes = utf8ByteLength(outputContent);
	return {
		content: outputContent,
		truncated: true,
		truncatedBy,
		totalLines,
		totalBytes,
		outputLines: outputLinesArr.length,
		outputBytes: finalOutputBytes,
		lastLinePartial: false,
		firstLineExceedsLimit: false,
		maxLines,
		maxBytes
	};
}
/**
* Truncate content from the tail (keep last N lines/bytes).
* Suitable for bash output where you want to see the end (errors, final results).
*
* May return partial first line if the last line of original content exceeds byte limit.
*/
function truncateTail(content, options = {}) {
	const maxLines = options.maxLines ?? 2e3;
	const maxBytes = options.maxBytes ?? 51200;
	const totalBytes = utf8ByteLength(content);
	const lines = content.split("\n");
	if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
	const totalLines = lines.length;
	if (totalLines <= maxLines && totalBytes <= maxBytes) return {
		content,
		truncated: false,
		truncatedBy: null,
		totalLines,
		totalBytes,
		outputLines: totalLines,
		outputBytes: totalBytes,
		lastLinePartial: false,
		firstLineExceedsLimit: false,
		maxLines,
		maxBytes
	};
	const outputLinesArr = [];
	let outputBytesCount = 0;
	let truncatedBy = "lines";
	let lastLinePartial = false;
	for (let i = lines.length - 1; i >= 0 && outputLinesArr.length < maxLines; i--) {
		const line = lines[i];
		const lineBytes = utf8ByteLength(line) + (outputLinesArr.length > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > maxBytes) {
			truncatedBy = "bytes";
			if (outputLinesArr.length === 0) {
				const truncatedLine = truncateStringToBytesFromEnd(line, maxBytes);
				outputLinesArr.unshift(truncatedLine);
				outputBytesCount = utf8ByteLength(truncatedLine);
				lastLinePartial = true;
			}
			break;
		}
		outputLinesArr.unshift(line);
		outputBytesCount += lineBytes;
	}
	if (outputLinesArr.length >= maxLines && outputBytesCount <= maxBytes) truncatedBy = "lines";
	const outputContent = outputLinesArr.join("\n");
	const finalOutputBytes = utf8ByteLength(outputContent);
	return {
		content: outputContent,
		truncated: true,
		truncatedBy,
		totalLines,
		totalBytes,
		outputLines: outputLinesArr.length,
		outputBytes: finalOutputBytes,
		lastLinePartial,
		firstLineExceedsLimit: false,
		maxLines,
		maxBytes
	};
}
/**
* Truncate a string to fit within a byte limit (from the end).
* Handles multi-byte UTF-8 characters correctly.
*/
function truncateStringToBytesFromEnd(str, maxBytes) {
	if (maxBytes <= 0) return "";
	let outputBytes = 0;
	let start = str.length;
	let needsReplacement = false;
	for (let i = str.length; i > 0;) {
		let characterStart = i - 1;
		const code = str.charCodeAt(characterStart);
		let characterBytes;
		let unpairedSurrogate = false;
		if (code >= 56320 && code <= 57343 && characterStart > 0) {
			const previous = str.charCodeAt(characterStart - 1);
			if (previous >= 55296 && previous <= 56319) {
				characterStart--;
				characterBytes = 4;
			} else {
				characterBytes = 3;
				unpairedSurrogate = true;
			}
		} else if (code >= 55296 && code <= 57343) {
			characterBytes = 3;
			unpairedSurrogate = true;
		} else characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
		if (outputBytes + characterBytes > maxBytes) break;
		outputBytes += characterBytes;
		start = characterStart;
		needsReplacement ||= unpairedSurrogate;
		i = characterStart;
	}
	const output = str.slice(start);
	return needsReplacement ? replaceUnpairedSurrogates(output) : output;
}
/**
* Truncate a single line to max characters, adding [truncated] suffix.
* Used for grep match lines.
*/
function truncateLine(line, maxChars = 500) {
	if (line.length <= maxChars) return {
		text: line,
		wasTruncated: false
	};
	return {
		text: `${line.slice(0, maxChars)}... [truncated]`,
		wasTruncated: true
	};
}
//#endregion
export { DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, GREP_MAX_LINE_LENGTH, formatSize, truncateHead, truncateLine, truncateTail };
