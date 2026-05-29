// Shared ffmpeg/ffprobe limits used by media probing and transcoding helpers.
/** Maximum buffered stderr/stdout size allowed for ffmpeg child processes. */
export const MEDIA_FFMPEG_MAX_BUFFER_BYTES = 10 * 1024 * 1024;
/** Default timeout for ffprobe metadata reads. */
export const MEDIA_FFPROBE_TIMEOUT_MS = 10_000;
/** Default timeout for ffmpeg transcode/probe operations. */
export const MEDIA_FFMPEG_TIMEOUT_MS = 45_000;
/** Maximum audio duration accepted for ffmpeg-backed media processing. */
export const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS = 20 * 60;
