// Keep this barrel helper-only so plugin-sdk facades do not pull the full
// channel plugin (and its runtime state) into tests or other shared surfaces.
/** Re-exported mattermost plugin public API, starting with is Mattermost Sender Allowed. */
export { isMattermostSenderAllowed } from "./src/mattermost/monitor-auth.js";
