import { render, screen } from "@testing-library/react";
import Home from "../page";

test("homepage renders hero, all projects, and footer email", () => {
  render(<Home />);
  expect(screen.getByText(/Modern websites and quiet automations/)).toBeInTheDocument();
  expect(screen.getByText("Zinc North")).toBeInTheDocument();
  expect(screen.getByText("Sonja Paints")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "hello@arlek.ca" })).toBeInTheDocument();
});
