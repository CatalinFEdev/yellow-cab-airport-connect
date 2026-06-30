# YELLOW WING — Airport Taxi (Vienna VIE Schwechat)

A modern airport taxi booking web app for Vienna International Airport (VIE Schwechat). Built with **React 19 + TanStack Start (SPA mode)**, **Vite 7**, **Tailwind CSS v4**, **shadcn/ui** and a black & yellow brand theme.

> The user originally requested Angular 21. Angular is not supported on this stack — the same product is delivered with React + TanStack Start.

---

## Features

- Branded landing page (black/yellow, Bebas Neue + Inter).
- Booking page (`/order`) with:
  - Live-style **arrivals board** for Vienna VIE Schwechat (14 sample flights).
  - **Client-side pagination** — 5 arrivals per page (Prev / Next / numbered).
  - Passenger form: first name, last name, phone, email, address, city, passengers, luggage, vehicle, notes.
  - **Inline validation**:
    - First/last name: letters, spaces, apostrophes and hyphens only — no digits or special chars.
    - Phone: international format with digits, spaces, `+`, `-`, `()`.
    - Email: standard RFC-style check.
  - **"Demo only" popup** on Confirm Booking (no real email is sent from the demo).
- AWS SES email integration (optional, see below) — `src/lib/order.functions.ts` + `src/lib/ses.server.ts`.
- Unit tests with Vitest + Testing Library (24 tests across 6 files).
- Production build configured to live under the subpath **`/airport-taxi/`**.
- Favicon + app icons served from `https://cattat-sys.com/airport-taxi/`.

---

## Tech Stack

- React 19, TanStack Start v1 (SPA / `ssr: false`), TanStack Router (file-based)
- Vite 7, TypeScript (strict)
- Tailwind CSS v4 (via `src/styles.css`), shadcn/ui, Radix primitives
- Zod for input validation
- Vitest, jsdom, @testing-library/react
- Bun as the package manager / runtime

---

## Getting Started

Requirements: **Bun** ≥ 1.1 (or Node 20+ with npm if you adapt the scripts).

```bash
bun install
bun run dev          # http://localhost:8080
bun run build        # production build -> dist/
bun run preview      # serve the built app locally
bun run test         # run unit tests once
bun run test:watch   # watch mode
bun run lint
bun run format
```

The dev server runs at `http://localhost:8080`.

---

## Project Structure

```
src/
  routes/
    __root.tsx         # App shell, head/meta, favicons, fonts
    index.tsx          # Landing page
    order.tsx          # Booking page (arrivals + form + pagination + demo popup)
  components/
    SiteHeader.tsx     # Branded header
    SiteFooter.tsx     # Branded footer
    ui/                # shadcn/ui primitives
  lib/
    order.functions.ts # TanStack server fn — validates + triggers SES
    ses.server.ts      # AWS SigV4 SES SendEmail (Web Crypto, Workers-compatible)
    utils.ts
  styles.css           # Tailwind v4 theme (black/yellow tokens, taxi-stripe utility)
  router.tsx           # Router + BASE_PATH (/airport-taxi in prod)
public/
  favicon.ico, apple-touch-icon.png, icon-512.png
vite.config.ts         # base: '/airport-taxi/' in prod
vitest.config.ts
```

---

## Deployment Under `/airport-taxi/` Subpath

The production build is configured to be served from `https://{your-domain}/airport-taxi/`.

- `vite.config.ts` sets `base: '/airport-taxi/'` in production.
- `src/router.tsx` sets `basepath: '/airport-taxi'` in production.

Deploy the contents of `dist/client/` to your web server under the `/airport-taxi/` path. The favicon and PNG icons in `public/` should be deployed to `https://cattat-sys.com/airport-taxi/` (or update the `<link>` URLs in `src/routes/__root.tsx` to your own host).

---

## Email (AWS SES) — Optional

The booking form currently shows a **demo-only popup** instead of sending email. The full SES integration is still wired and can be re-enabled by calling `sendOrderEmail` from `src/routes/order.tsx` in place of `setShowDemo(true)`.

Mailbox (FROM and TO): `foto@catalinalexandru.at` (Amazon WorkMail identity verified in SES).

Required environment variables (read at request-time inside `src/lib/ses.server.ts`):

| Variable | Description |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | IAM access key with `ses:SendEmail` |
| `AWS_SECRET_ACCESS_KEY` | Matching secret |
| `AWS_REGION` | SES region of the verified identity (e.g. `eu-central-1`) |

The signer uses pure Web Crypto (SigV4) so it works on Cloudflare Workers / edge runtimes — no Node-only SDK required.

---

## Testing

```bash
bun run test
```

Covers:
- `src/lib/utils.test.ts` — class merge helper
- `src/lib/order.schema.test.ts` — Zod order payload
- `src/lib/pagination.test.ts` — pagination math
- `src/lib/ses.signing.test.ts` — SigV4 primitives
- `src/components/SiteHeader.test.tsx` / `SiteFooter.test.tsx` — rendering

---

## Brand & Theme

- Colors: black (`#0a0a0a`) + taxi yellow (`#facc15`-ish via `oklch` tokens).
- Fonts: **Bebas Neue** (display) + **Inter** (body), loaded via Google Fonts in `__root.tsx`.
- `taxi-stripe` utility in `src/styles.css` produces the black/yellow checker accent.

All colors are semantic tokens in `src/styles.css` — never hardcode `bg-black` / `text-yellow-400` in components.

---

## License

Private demo project.
