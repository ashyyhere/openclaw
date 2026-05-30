import * as path from "node:path";
import { writeBase64ToFile } from "./nodes-camera.js";
import { asRecord, asString, resolveTempPathParts } from "./nodes-media-utils.js";

/** Gateway payload returned by node screen-record commands. */
export type ScreenRecordPayload = {
  format: string;
  base64: string;
  durationMs?: number;
  fps?: number;
  screenIndex?: number;
  hasAudio?: boolean;
};

/** Validates and normalizes a raw node screen-record payload. */
export function parseScreenRecordPayload(value: unknown): ScreenRecordPayload {
  const obj = asRecord(value);
  const format = asString(obj.format);
  const base64 = asString(obj.base64);
  if (!format || !base64) {
    throw new Error("invalid screen.record payload");
  }
  return {
    format,
    base64,
    durationMs: typeof obj.durationMs === "number" ? obj.durationMs : undefined,
    fps: typeof obj.fps === "number" ? obj.fps : undefined,
    screenIndex: typeof obj.screenIndex === "number" ? obj.screenIndex : undefined,
    hasAudio: typeof obj.hasAudio === "boolean" ? obj.hasAudio : undefined,
  };
}

/** Builds the default temp file path for a downloaded screen recording. */
export function screenRecordTempPath(opts: { ext: string; tmpDir?: string; id?: string }) {
  const { tmpDir, id, ext } = resolveTempPathParts(opts);
  return path.join(tmpDir, `openclaw-screen-record-${id}${ext}`);
}

/** Writes a base64 screen recording payload to disk with optional size limits. */
export async function writeScreenRecordToFile(
  filePath: string,
  base64: string,
  opts?: { maxBytes?: number },
) {
  return writeBase64ToFile(filePath, base64, opts);
}
