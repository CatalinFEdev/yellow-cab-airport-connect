import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Stub TanStack Router's <Link> with a plain anchor so we don't need a full
// router context just to render the header.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className, ...rest }: any) => (
    <a href={typeof to === "string" ? to : "#"} className={className} {...rest}>
      {children}
    </a>
  ),
}));

import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders the brand", () => {
    render(<SiteHeader />);
    expect(screen.getByText(/YELLOW WING/i)).toBeInTheDocument();
    expect(screen.getByText(/Airport Taxi/i)).toBeInTheDocument();
  });

  it("renders navigation links to home and order", () => {
    render(<SiteHeader />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/order");
  });

  it("renders a primary Book Now CTA", () => {
    render(<SiteHeader />);
    expect(screen.getByText(/book now/i)).toBeInTheDocument();
  });
});
