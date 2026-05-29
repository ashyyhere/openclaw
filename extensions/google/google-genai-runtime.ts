// extensions/google google genai runtime helpers and runtime behavior.
import { GoogleGenAI } from "@google/genai";

export type GoogleGenAIClient = InstanceType<typeof GoogleGenAI>;
type GoogleGenAIOptions = ConstructorParameters<typeof GoogleGenAI>[0];

export function createGoogleGenAI(options: GoogleGenAIOptions): GoogleGenAIClient {
  return new GoogleGenAI(options);
}
