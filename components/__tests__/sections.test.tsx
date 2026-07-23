import { render, screen } from "@testing-library/react";
import TopBar from "../TopBar";
import Hero from "../Hero";
import Footer from "../Footer";

const PROJECT_MAILTO = "mailto:hello@arlek.ca?subject=Website%20project";

test("topbar shows availability and a contact link that goes somewhere real", () => {
  render(<TopBar />);
  expect(screen.getByText("Available for new projects")).toBeInTheDocument();
  const cta = screen.getByRole("link", { name: /start a project/i });
  expect(cta).toHaveAttribute("href", PROJECT_MAILTO);
});

test("hero renders the real headline text, not scrambled characters", () => {
  render(<Hero />);
  expect(screen.getByText("Websites and automation")).toBeInTheDocument();
  expect(screen.getByText("for Canadian small businesses.")).toBeInTheDocument();
});

test("hero headline is an h1", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("footer links the contact email", () => {
  render(<Footer />);
  const mail = screen.getByRole("link", { name: "hello@arlek.ca" });
  expect(mail).toHaveAttribute("href", "mailto:hello@arlek.ca");
});
