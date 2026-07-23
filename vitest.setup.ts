import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia. Default every test to "motion is fine";
// tests that care about reduced motion override this themselves.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
