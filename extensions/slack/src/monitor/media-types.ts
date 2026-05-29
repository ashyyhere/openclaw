// extensions/slack/src/monitor media types helpers and runtime behavior.
export type SlackMediaResult = {
  path: string;
  contentType?: string;
  placeholder: string;
};

export const MAX_SLACK_MEDIA_FILES = 8;
