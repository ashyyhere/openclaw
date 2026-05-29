/** Vitest mocks that keep web_fetch tests from loading bundled extractors. */
import { vi } from "vitest";

// Avoid loading the bundled readability plugin in unit test suites.
vi.mock("../../web-fetch/content-extractors.runtime.js", () => {
  return {
    extractReadableContent: vi.fn().mockResolvedValue({
      extractor: "readability",
      title: "HTML Page",
      text: "HTML Page\n\nContent here.",
    }),
  };
});
