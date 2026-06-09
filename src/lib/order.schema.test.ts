import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-declare the schema shape for isolated unit tests so we don't import the
// server function (which pulls in process.env / fetch logic at module load).
const OrderSchema = z.object({
  reference: z.string().min(1).max(32),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(1).max(40),
  email: z.string().email().max(200).optional().or(z.literal("")),
  address: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  passengers: z.number().int().min(1).max(8),
  luggage: z.number().int().min(0).max(10),
  notes: z.string().max(1000).optional().or(z.literal("")),
  vehicle: z.string().min(1).max(40),
  flight: z.object({
    number: z.string().min(1).max(20),
    airline: z.string().min(1).max(100),
    from: z.string().min(1).max(120),
    date: z.string().min(1).max(20),
    time: z.string().min(1).max(10),
    terminal: z.string().min(1).max(10),
  }),
});

const validOrder = {
  reference: "YW-12345",
  firstName: "Ada",
  lastName: "Lovelace",
  phone: "+43 1 23456",
  email: "ada@example.com",
  address: "Stephansplatz 1",
  city: "Vienna",
  passengers: 2,
  luggage: 1,
  notes: "",
  vehicle: "Sedan",
  flight: {
    number: "OS232",
    airline: "Austrian",
    from: "FRA",
    date: "2026-06-08",
    time: "13:50",
    terminal: "T3",
  },
};

describe("OrderSchema", () => {
  it("accepts a fully valid payload", () => {
    expect(() => OrderSchema.parse(validOrder)).not.toThrow();
  });

  it("accepts empty string email (optional contact)", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, email: "" }),
    ).not.toThrow();
  });

  it("rejects invalid email", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects 0 passengers", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, passengers: 0 }),
    ).toThrow();
  });

  it("rejects >8 passengers", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, passengers: 9 }),
    ).toThrow();
  });

  it("rejects missing flight number", () => {
    expect(() =>
      OrderSchema.parse({
        ...validOrder,
        flight: { ...validOrder.flight, number: "" },
      }),
    ).toThrow();
  });

  it("rejects negative luggage", () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, luggage: -1 }),
    ).toThrow();
  });
});
