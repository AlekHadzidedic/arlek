import { render, screen, waitFor } from "@testing-library/react";
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

test("an offset run still animates", async () => {
  // Regression: the offset used to arrive as a delay in milliseconds, read from
  // a constant exported by this "use client" module. A server component
  // importing that got a client reference rather than a number, so the total
  // duration became NaN, `elapsed < NaN` was false, and the second line of the
  // headline bailed to plain text on its first frame — it never scrambled.
  mockMotion(false);
  const { container } = render(<Decode text="for Canadian" indexOffset={23} />);

  await waitFor(() => {
    expect(container.querySelectorAll(".text-accent").length).toBeGreaterThan(0);
  });
});
