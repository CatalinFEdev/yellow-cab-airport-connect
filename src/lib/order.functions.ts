import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendEmailViaSES } from "./ses.server";

const MAILBOX = "foto@catalinalexandru.at";

const OrderSchema = z.object({
  reference: z.string().min(1).max(32),
  firstName: z.string().min(1).max(100),
  lastName:  z.string().min(1).max(100),
  phone:     z.string().min(1).max(40),
  email:     z.string().email().max(200).optional().or(z.literal("")),
  address:   z.string().min(1).max(300),
  city:      z.string().min(1).max(100),
  passengers: z.number().int().min(1).max(8),
  luggage:    z.number().int().min(0).max(10),
  notes:     z.string().max(1000).optional().or(z.literal("")),
  vehicle:   z.string().min(1).max(40),
  flight: z.object({
    number:   z.string().min(1).max(20),
    airline:  z.string().min(1).max(100),
    from:     z.string().min(1).max(120),
    date:     z.string().min(1).max(20),
    time:     z.string().min(1).max(10),
    terminal: z.string().min(1).max(10),
  }),
});

export type OrderPayload = z.infer<typeof OrderSchema>;

export const sendOrderEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => OrderSchema.parse(data))
  .handler(async ({ data }) => {
    const subject = `New transfer booking ${data.reference} — ${data.flight.number} (${data.flight.from})`;
    const bodyText = [
      `New airport transfer booking`,
      `Reference: ${data.reference}`,
      ``,
      `— Flight —`,
      `Flight:    ${data.flight.number} (${data.flight.airline})`,
      `From:      ${data.flight.from}`,
      `Arrival:   ${data.flight.date} ${data.flight.time}  •  Terminal ${data.flight.terminal}`,
      ``,
      `— Passenger —`,
      `Name:      ${data.firstName} ${data.lastName}`,
      `Phone:     ${data.phone}`,
      `Email:     ${data.email || "—"}`,
      `Pax:       ${data.passengers}    Luggage: ${data.luggage}`,
      `Vehicle:   ${data.vehicle}`,
      ``,
      `— Drop-off —`,
      `Address:   ${data.address}`,
      `City:      ${data.city}`,
      ``,
      `— Notes —`,
      data.notes || "(none)",
    ].join("\n");

    const { messageId } = await sendEmailViaSES({
      from: MAILBOX,
      to: MAILBOX,
      replyTo: data.email || undefined,
      subject,
      bodyText,
    });

    return { ok: true as const, messageId };
  });
