import { render, screen } from "@testing-library/react";
import Home from "../page";

test("homepage renders hero, all projects, and footer email", () => {
  render(<Home />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
  // "Zinc North" is both a project card heading and the Rebuild section
  // counter, so match the heading specifically.
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

test("the rebuild testimonial is attributed to Eric", () => {
  render(<Home />);
  expect(screen.getByText(/The final result exceeded my expectations/)).toBeInTheDocument();
  expect(screen.getByText("Eric")).toBeInTheDocument();
});
