import { fireEvent, render, screen } from "@testing-library/react";
import Home from "../page";
import ZincNorth from "../work/zinc-north/page";

test("homepage renders hero, all projects, and footer email", () => {
  render(<Home />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Zinc North" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Sonja Paints" })).toBeInTheDocument();
  expect(screen.getByText("What I do")).toBeInTheDocument();
  expect(screen.getByText("Quiet automations")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "hello@arlek.ca" })).toBeInTheDocument();
});

test("no link points at a bare #book fragment", () => {
  render(<Home />);
  for (const link of screen.getAllByRole("link")) {
    expect(link.getAttribute("href")).not.toBe("#book");
  }
});

test("headings form an outline with no skipped levels", () => {
  render(<Home />);
  const levels = screen
    .getAllByRole("heading")
    .map((h) => Number(h.tagName.slice(1)));

  expect(levels.filter((l) => l === 1)).toHaveLength(1);
  expect(levels).toContain(2);
  expect(levels).toContain(3);
  expect(levels).not.toContain(4);
});

test("the rebuild no longer sits on the landing page", () => {
  render(<Home />);
  expect(screen.queryByText(/The final result exceeded my expectations/)).toBeNull();
  expect(screen.queryByText("What changed")).toBeNull();
});

test("the case study states the diff, shows both pages, and quotes Eric", () => {
  render(<ZincNorth />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Zinc North");
  expect(screen.getByText("What changed")).toBeInTheDocument();
  expect(
    screen.getByText("“Precision plating for Northern Ontario's toughest jobs”"),
  ).toBeInTheDocument();
  // One rectangle holds both states now, so each screenshot appears once.
  expect(screen.getByAltText(/original Wix/i)).toBeInTheDocument();
  expect(screen.getByAltText(/rebuilt zincnorth\.ca/i)).toBeInTheDocument();
  expect(screen.getByText(/The final result exceeded my expectations/)).toBeInTheDocument();
  expect(screen.getByText("Eric")).toBeInTheDocument();
});

test("the comparison wipe is operable without a pointer", () => {
  render(<ZincNorth />);
  const wipe = screen.getByRole("slider", { name: /drag to wipe/i });
  expect(wipe).toHaveAttribute("aria-valuenow", "50");
  fireEvent.keyDown(wipe, { key: "ArrowRight" });
  expect(wipe).toHaveAttribute("aria-valuenow", "52");
  // Home is the site as it was, End is the site as it shipped.
  fireEvent.keyDown(wipe, { key: "Home" });
  expect(wipe).toHaveAttribute("aria-valuenow", "100");
  fireEvent.keyDown(wipe, { key: "End" });
  expect(wipe).toHaveAttribute("aria-valuenow", "0");
});

test("the case study links back to the work index and out to the live site", () => {
  render(<ZincNorth />);
  const back = screen.getAllByRole("link", { name: /work index/i });
  expect(back).toHaveLength(2);
  for (const link of back) expect(link).toHaveAttribute("href", "/#work");
  expect(screen.getByRole("link", { name: /visit zincnorth\.ca/i })).toHaveAttribute(
    "href",
    "https://zincnorth.ca",
  );
});
