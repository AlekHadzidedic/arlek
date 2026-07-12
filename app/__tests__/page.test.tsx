import { render, screen } from "@testing-library/react";
import Home from "../page";

test("homepage renders hero, all projects, and footer email", () => {
  render(<Home />);
  expect(screen.getByText(/Modern websites and quiet automations/)).toBeInTheDocument();
  expect(screen.getByText("Zinc North")).toBeInTheDocument();
  expect(screen.getByText("Sonja Paints")).toBeInTheDocument();
  expect(screen.getByText("What I do")).toBeInTheDocument();
  expect(screen.getByText("Quiet automations")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "hello@arlek.ca" })).toBeInTheDocument();
});
