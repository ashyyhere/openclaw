//#region packages/speech-core/speaker.ts
function readString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function withSpeakerSelectionCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = readString(next.speakerVoice);
	const speakerVoiceId = readString(next.speakerVoiceId);
	const voice = readString(next.voice);
	const voiceName = readString(next.voiceName);
	const voiceId = readString(next.voiceId);
	const canonicalVoice = speakerVoice ?? voice ?? voiceName;
	const canonicalVoiceId = speakerVoiceId ?? voiceId;
	if (canonicalVoice) {
		next.speakerVoice = canonicalVoice;
		next.voice = canonicalVoice;
		next.voiceName = canonicalVoice;
	}
	if (canonicalVoiceId) {
		next.speakerVoiceId = canonicalVoiceId;
		next.voiceId = canonicalVoiceId;
	}
	return next;
}
function withSpeakerSelectionFallbackCompat(config) {
	const next = config ? { ...config } : {};
	const speakerVoice = readString(next.speakerVoice);
	const speakerVoiceId = readString(next.speakerVoiceId);
	if (speakerVoice) {
		next.voice ??= speakerVoice;
		next.voiceName ??= speakerVoice;
	}
	if (speakerVoiceId) next.voiceId ??= speakerVoiceId;
	return next;
}
//#endregion
export { withSpeakerSelectionCompat, withSpeakerSelectionFallbackCompat };
