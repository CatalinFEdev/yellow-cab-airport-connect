import { describe, it, expect } from "vitest";

/**
 * Mirror of the pagination math used by the booking page (PAGE_SIZE = 5).
 * Kept here as a pure function so it can be unit-tested without rendering.
 */
const PAGE_SIZE = 5;

function paginate<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return {
    page: safePage,
    totalPages,
    items: items.slice(start, end),
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(end, items.length),
    total: items.length,
  };
}

describe("paginate", () => {
  const items = Array.from({ length: 14 }, (_, i) => i + 1);

  it("returns first 5 items on page 1", () => {
    const r = paginate(items, 1);
    expect(r.items).toEqual([1, 2, 3, 4, 5]);
    expect(r.totalPages).toBe(3);
    expect(r.from).toBe(1);
    expect(r.to).toBe(5);
  });

  it("returns middle page correctly", () => {
    const r = paginate(items, 2);
    expect(r.items).toEqual([6, 7, 8, 9, 10]);
  });

  it("handles last partial page", () => {
    const r = paginate(items, 3);
    expect(r.items).toEqual([11, 12, 13, 14]);
    expect(r.to).toBe(14);
  });

  it("clamps page above totalPages", () => {
    const r = paginate(items, 99);
    expect(r.page).toBe(3);
  });

  it("clamps page below 1", () => {
    const r = paginate(items, 0);
    expect(r.page).toBe(1);
  });

  it("returns empty state for empty input", () => {
    const r = paginate([], 1);
    expect(r.items).toEqual([]);
    expect(r.from).toBe(0);
    expect(r.to).toBe(0);
    expect(r.totalPages).toBe(1);
  });
});
