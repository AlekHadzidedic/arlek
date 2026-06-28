import { render, screen } from "@testing-library/react";
import TopBar from "../TopBar";
import Hero from "../Hero";
import Footer from "../Footer";

test("topbar shows availability and book link", () => {
  render(<TopBar />);
  expect(screen.getByText("Available · April 2026")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /book a call/i })).toBeInTheDocument();
});

test("hero contains the headline copy", () => {
  render(<Hero />);
  expect(screen.getByText(/Modern websites and quiet automations/)).toBeInTheDocument();
});

test("footer links the contact email", () => {
  render(<Footer />);
  const mail = screen.getByRole("link", { name: "hello@arlek.ca" });
  expect(mail).toHaveAttribute("href", "mailto:hello@arlek.ca");
});
