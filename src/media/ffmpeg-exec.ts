// Thin ffmpeg/ffprobe execution wrappers shared by media inspection and
// transform code. All binaries resolve through trusted system paths.
import { execFile, type ExecFileOptions } from "node:child_process";
import { promisify } from "node:util";
import { resolveSystemBin } from "../infra/resolve-system-bin.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import {
  MEDIA_FFMPEG_MAX_BUFFER_BYTES,
  MEDIA_FFMPEG_TIMEOUT_MS,
  MEDIA_FFPROBE_TIMEOUT_MS,
} from "./ffmpeg-limits.js";

const execFileAsync = promisify(execFile);

/** Execution limits and stdin payload for ffmpeg/ffprobe invocations. */
export type MediaExecOptions = {
  timeoutMs?: number;
  maxBufferBytes?: number;
  input?: Buffer | string;
};

function resolveExecOptions(
  defaultTimeoutMs: number,
  options: MediaExecOptions | undefined,
): ExecFileOptions {
  return {
    timeout: options?.timeoutMs ?? defaultTimeoutMs,
    maxBuffer: options?.maxBufferBytes ?? MEDIA_FFMPEG_MAX_BUFFER_BYTES,
  };
}

function requireSystemBin(name: string): string {
  const resolved = resolveSystemBin(name, { trust: "standard" });
  if (!resolved) {
    const hint =
      process.platform === "darwin"
        ? "e.g. brew install ffmpeg"
        : "e.g. apt install ffmpeg / dnf install ffmpeg";
    throw new Error(
      `${name} not found in trusted system directories. ` +
        `Install it via your system package manager (${hint}).`,
    );
  }
  return resolved;
}

/** Resolve the trusted ffmpeg binary or throw with an install hint. */
export function resolveFfmpegBin(): string {
  return requireSystemBin("ffmpeg");
}

function isBrokenPipeError(error: Error): boolean {
  return (error as NodeJS.ErrnoException).code === "EPIPE";
}

/** Run ffprobe with OpenClaw's timeout/buffer defaults. */
export async function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string> {
  const execOptions = resolveExecOptions(MEDIA_FFPROBE_TIMEOUT_MS, options);
  if (options?.input == null) {
    const { stdout } = await execFileAsync(requireSystemBin("ffprobe"), args, execOptions);
    return stdout.toString();
  }

  return await new Promise<string>((resolve, reject) => {
    let stdinWriteError: Error | undefined;
    const proc = execFile(requireSystemBin("ffprobe"), args, execOptions, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      if (stdinWriteError && !isBrokenPipeError(stdinWriteError)) {
        reject(stdinWriteError);
        return;
      }
      resolve(stdout.toString());
    });
    proc.stdin?.once("error", (err: Error) => {
      stdinWriteError = err;
    });
    proc.stdin?.end(options.input);
  });
}

/** Run ffmpeg with OpenClaw's timeout/buffer defaults. */
export async function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string> {
  const { stdout } = await execFileAsync(
    resolveFfmpegBin(),
    args,
    resolveExecOptions(MEDIA_FFMPEG_TIMEOUT_MS, options),
  );
  return stdout.toString();
}

/** Parse compact ffprobe CSV output into normalized lowercase fields. */
export function parseFfprobeCsvFields(stdout: string, maxFields: number): string[] {
  return stdout
    .trim()
    .split(/[,\r\n]+/, maxFields)
    .map((field) => normalizeLowercaseStringOrEmpty(field));
}

function parseFfprobeSampleRateHz(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) {
    return null;
  }
  const sampleRate = Number(value);
  return Number.isSafeInteger(sampleRate) && sampleRate > 0 ? sampleRate : null;
}

/** Extract codec and sample-rate facts from ffprobe CSV output. */
export function parseFfprobeCodecAndSampleRate(stdout: string): {
  codec: string | null;
  sampleRateHz: number | null;
} {
  const [codecRaw, sampleRateRaw] = parseFfprobeCsvFields(stdout, 2);
  const codec = codecRaw ? codecRaw : null;
  return {
    codec,
    sampleRateHz: parseFfprobeSampleRateHz(sampleRateRaw),
  };
}
