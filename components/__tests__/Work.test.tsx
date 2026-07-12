import { render, screen } from "@testing-library/react";
import Work from "../Work";
import { projects } from "../../content/projects";

test("renders every project name and description", () => {
  render(<Work />);
  for (const p of projects) {
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(p.desc)).toBeInTheDocument();
  }
});

test("renders the selected-work section head", () => {
  render(<Work />);
  expect(screen.getByText("Selected work")).toBeInTheDocument();
  expect(screen.getByText("03 · 2024–2026")).toBeInTheDocument();
});

test("does not render cut projects", () => {
  render(<Work />);
  expect(screen.queryByText("Spend Monitor")).not.toBeInTheDocument();
  expect(screen.queryByText("Inside Joke")).not.toBeInTheDocument();
});
