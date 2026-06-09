import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./SiteHeader";
import { renderWithRouter } from "@/test/router-utils";

describe("SiteHeader", () => {
  it("renders the brand and navigation links", async () => {
    render(renderWithRouter(<SiteHeader />));
    expect(await screen.findByText(/YELLOW WING/i)).toBeInTheDocument();
    expect(screen.getByText(/Airport Taxi/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /book/i }).length).toBeGreaterThan(0);
  });

  it("links to the order page", async () => {
    render(renderWithRouter(<SiteHeader />));
    await screen.findByText(/YELLOW WING/i);
    const orderLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/order");
    expect(orderLinks.length).toBeGreaterThan(0);
  });
});
