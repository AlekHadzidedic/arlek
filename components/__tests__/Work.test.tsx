import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "../Work";
import { projects } from "../../content/projects";

test("renders every project as an index row with its tagline and stack", () => {
  render(<Work />);
  for (const p of projects) {
    expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
    expect(screen.getByText(p.tagline)).toBeInTheDocument();
    expect(screen.getByText(p.stack)).toBeInTheDocument();
  }
});

test("every row links out to the live site", () => {
  render(<Work />);
  const links = screen.getAllByRole("link");
  for (const p of projects) {
    // Matched by destination rather than by name: the case-study link names
    // its project too, so a name regex would match two different links.
    const row = links.find((l) => l.getAttribute("href") === p.url);
    expect(row).toBeDefined();
    expect(row).toHaveAttribute("rel", "noopener noreferrer");
    expect(row).toHaveTextContent(p.name);
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

test("renders every project's screenshot", () => {
  render(<Work />);
  for (const p of projects) {
    // The still appears twice by design: once in the row for touch and small
    // screens, once in the preview column's cross-fade stack for large ones.
    expect(screen.getAllByAltText(p.alt).length).toBeGreaterThan(0);
  }
});

test("hovering a row makes it the active preview", async () => {
  const user = userEvent.setup();
  render(<Work />);

  const second = screen.getByRole("link", { name: new RegExp(projects[1].name, "i") });
  await user.hover(second);

  // The preview caption names whichever project is active.
  const captions = screen.getAllByText(new RegExp(projects[1].name));
  expect(captions.length).toBeGreaterThan(1);
});

test("closes the index with a link to the Zinc North case-study page", () => {
  render(<Work />);
  const caseStudy = screen.getByRole("link", { name: /case study/i });
  expect(caseStudy).toHaveAttribute("href", "/work/zinc-north");
  expect(caseStudy).toHaveTextContent(/before and after/i);
});
