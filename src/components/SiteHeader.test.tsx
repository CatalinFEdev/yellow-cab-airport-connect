import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./SiteHeader";
import { renderWithRouter } from "@/test/router-utils";

describe("SiteHeader", () => {
  it("renders the brand and navigation links", () => {
    render(renderWithRouter(<SiteHeader />));
    expect(screen.getByText(/YELLOW WING/i)).toBeInTheDocument();
    expect(screen.getByText(/Airport Taxi/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /book/i }).length).toBeGreaterThan(0);
  });

  it("links to the order page", () => {
    render(renderWithRouter(<SiteHeader />));
    const orderLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/order");
    expect(orderLinks.length).toBeGreaterThan(0);
  });
});
