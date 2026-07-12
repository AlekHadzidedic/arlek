import { render, screen } from "@testing-library/react";
import Offer from "../Offer";
import About from "../About";

test("renders the offer section head and all service titles", () => {
  render(<Offer />);
  expect(screen.getByText("What I do")).toBeInTheDocument();
  expect(screen.getByText("Design & build")).toBeInTheDocument();
  expect(screen.getByText("Care & upkeep")).toBeInTheDocument();
  expect(screen.getByText("Quiet automations")).toBeInTheDocument();
  expect(
    screen.getByText(/Your site redesigned and rebuilt/)
  ).toBeInTheDocument();
});

test("renders the about strip with the Ottawa line", () => {
  render(<About />);
  expect(screen.getByText(/Ottawa-based developer/)).toBeInTheDocument();
});
