import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders brand, contact and service info", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/YELLOW WING/)).toBeInTheDocument();
    expect(screen.getByText(/dispatch@yellowwing\.taxi/)).toBeInTheDocument();
    expect(screen.getByText(/Service Area/i)).toBeInTheDocument();
  });

  it("shows the current year in the copyright", () => {
    render(<SiteFooter />);
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });
});
