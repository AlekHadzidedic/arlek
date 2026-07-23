import { render, screen } from "@testing-library/react";
import Decode from "../Decode";

function mockMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

test("renders the real text on first paint, not scrambled characters", () => {
  mockMotion(false);
  render(<Decode text="Websites and automation" />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
});

test("renders the real text when reduced motion is preferred", () => {
  mockMotion(true);
  render(<Decode text="for Canadian small businesses." />);
  expect(screen.getByText("for Canadian small businesses.")).toBeInTheDocument();
});

test("applies the supplied className to the rendered text", () => {
  mockMotion(true);
  render(<Decode text="Zinc North" className="text-fg-3" />);
  expect(screen.getByText("Zinc North")).toHaveClass("text-fg-3");
});
