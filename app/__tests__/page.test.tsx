import { render, screen } from "@testing-library/react";
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
  // Before and after each appear twice: cropped to the fold, then in full.
  expect(screen.getAllByAltText(/original Wix/i)).toHaveLength(2);
  expect(screen.getAllByAltText(/rebuilt zincnorth\.ca/i)).toHaveLength(2);
  expect(screen.getByText(/The final result exceeded my expectations/)).toBeInTheDocument();
  expect(screen.getByText("Eric")).toBeInTheDocument();
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
