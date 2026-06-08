import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Plane, Check } from "lucide-react";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Book a Taxi — Yellow Wing" },
      { name: "description", content: "Reserve an airport taxi transfer. Pick your arriving flight and we'll meet you at the gate." },
      { property: "og:title", content: "Book a Taxi — Yellow Wing" },
      { property: "og:description", content: "Reserve an airport taxi transfer with flight tracking." },
    ],
  }),
  component: OrderPage,
});

type Arrival = {
  id: string;
  flight: string;
  airline: string;
  from: string;
  date: string; // ISO date
  time: string; // HH:mm
  terminal: string;
  status: "On time" | "Delayed" | "Landed";
};

// Mocked airport arrivals board — Vienna International (VIE), Schwechat
const ARRIVALS: Arrival[] = [
  { id: "a1",  flight: "OS232", airline: "Austrian Airlines", from: "Frankfurt (FRA)",  date: "2026-06-08", time: "13:50", terminal: "T3", status: "On time" },
  { id: "a2",  flight: "LH1234", airline: "Lufthansa",        from: "Munich (MUC)",     date: "2026-06-08", time: "14:25", terminal: "T1", status: "On time" },
  { id: "a3",  flight: "BA700", airline: "British Airways",   from: "London (LHR)",     date: "2026-06-08", time: "15:10", terminal: "T3", status: "Delayed" },
  { id: "a4",  flight: "AF1138", airline: "Air France",       from: "Paris (CDG)",      date: "2026-06-08", time: "15:55", terminal: "T1", status: "On time" },
  { id: "a5",  flight: "KL1843", airline: "KLM",              from: "Amsterdam (AMS)",  date: "2026-06-08", time: "16:30", terminal: "T1", status: "On time" },
  { id: "a6",  flight: "EK127", airline: "Emirates",          from: "Dubai (DXB)",      date: "2026-06-08", time: "17:05", terminal: "T3", status: "Landed" },
  { id: "a7",  flight: "TK1887", airline: "Turkish Airlines", from: "Istanbul (IST)",   date: "2026-06-08", time: "17:40", terminal: "T1", status: "On time" },
  { id: "a8",  flight: "IB3170", airline: "Iberia",           from: "Madrid (MAD)",     date: "2026-06-08", time: "18:15", terminal: "T1", status: "Delayed" },
  { id: "a9",  flight: "AZ420", airline: "ITA Airways",       from: "Rome (FCO)",       date: "2026-06-08", time: "18:45", terminal: "T1", status: "On time" },
  { id: "a10", flight: "SU2030", airline: "Aeroflot",         from: "Zurich (ZRH)",     date: "2026-06-08", time: "19:00", terminal: "T3", status: "On time" },
  { id: "a11", flight: "OS066", airline: "Austrian Airlines", from: "New York (JFK)",   date: "2026-06-08", time: "19:35", terminal: "T3", status: "On time" },
  { id: "a12", flight: "QR185", airline: "Qatar Airways",     from: "Doha (DOH)",       date: "2026-06-08", time: "20:10", terminal: "T1", status: "Delayed" },
  { id: "a13", flight: "LX1574", airline: "SWISS",            from: "Geneva (GVA)",     date: "2026-06-08", time: "20:45", terminal: "T1", status: "On time" },
  { id: "a14", flight: "SN2901", airline: "Brussels Airlines", from: "Brussels (BRU)",  date: "2026-06-08", time: "21:15", terminal: "T1", status: "On time" },
];

const VEHICLES = [
  { id: "sedan", name: "Sedan", pax: "1–3 pax", price: 45 },
  { id: "van",   name: "Van",   pax: "4–7 pax", price: 75 },
  { id: "lux",   name: "Luxury", pax: "1–3 pax", price: 95 },
];

function OrderPage() {
  const [search, setSearch] = useState("");
  const [selectedArrival, setSelectedArrival] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState("sedan");
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", city: "", passengers: 1, luggage: 1, notes: "",
  });
  const [submitted, setSubmitted] = useState<null | { ref: string }>(null);

  const filtered = useMemo(
    () => ARRIVALS.filter(a =>
      `${a.flight} ${a.airline} ${a.from}`.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const arrival = ARRIVALS.find(a => a.id === selectedArrival) ?? null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!arrival) return;
    const ref = "YW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setSubmitted({ ref });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-primary flex items-center justify-center">
            <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
          </div>
          <h1 className="mt-6 font-display text-4xl">Booking Confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            Reference <span className="font-mono font-bold text-foreground">{submitted.ref}</span>. We'll be tracking flight {arrival?.flight} and a driver will meet you at {arrival?.terminal}.
          </p>
          <button
            onClick={() => { setSubmitted(null); setSelectedArrival(null); }}
            className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold uppercase tracking-wider"
          >
            Book another
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12">
        <div className="mb-10">
          <span className="inline-block bg-secondary text-primary px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">Step 1 of 2</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Book Your Airport Transfer</h1>
          <p className="mt-2 text-muted-foreground">Pick your arriving flight, tell us where you're going, done.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Arrivals board */}
          <section className="lg:col-span-3">
            <div className="bg-secondary text-secondary-foreground rounded-t-xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl tracking-wider">Airport Arrivals</h2>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search flight, city…"
                className="bg-white/10 placeholder-white/50 text-sm px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="border border-t-0 border-border rounded-b-xl overflow-hidden bg-card">
              <div className="grid grid-cols-12 text-[11px] uppercase tracking-wider text-muted-foreground bg-muted px-4 py-2 font-semibold">
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Flight</div>
                <div className="col-span-4">From</div>
                <div className="col-span-2">Term.</div>
                <div className="col-span-2">Status</div>
              </div>
              <ul className="divide-y divide-border max-h-[460px] overflow-y-auto">
                {filtered.map(a => {
                  const active = a.id === selectedArrival;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedArrival(a.id)}
                        className={`w-full grid grid-cols-12 items-center px-4 py-3 text-left text-sm transition ${
                          active ? "bg-primary/15 border-l-4 border-primary" : "hover:bg-muted"
                        }`}
                      >
                        <div className="col-span-2">
                          <div className="font-mono font-bold">{a.time}</div>
                          <div className="text-[11px] text-muted-foreground">{a.date}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="font-bold">{a.flight}</div>
                          <div className="text-[11px] text-muted-foreground">{a.airline}</div>
                        </div>
                        <div className="col-span-4">{a.from}</div>
                        <div className="col-span-2">{a.terminal}</div>
                        <div className="col-span-2">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            a.status === "On time" ? "bg-green-100 text-green-800" :
                            a.status === "Delayed" ? "bg-red-100 text-red-800" :
                            "bg-primary/20 text-foreground"
                          }`}>
                            {a.status}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">No flights match your search.</li>
                )}
              </ul>
            </div>
          </section>

          {/* Form */}
          <section className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-xl">Passenger Details</h2>
                <p className="text-xs text-muted-foreground">
                  {arrival ? `Pickup linked to ${arrival.flight} from ${arrival.from}.` : "Select a flight from the arrivals board."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" required>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input" />
                </Field>
                <Field label="Last name" required>
                  <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input" />
                </Field>
              </div>

              <Field label="Drop-off address" required>
                <input required placeholder="Street, number" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input" />
              </Field>
              <Field label="City" required>
                <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" required>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Passengers">
                  <input type="number" min={1} max={8} value={form.passengers} onChange={e => setForm({...form, passengers: +e.target.value})} className="input" />
                </Field>
                <Field label="Luggage">
                  <input type="number" min={0} max={10} value={form.luggage} onChange={e => setForm({...form, luggage: +e.target.value})} className="input" />
                </Field>
              </div>

              <Field label="Vehicle">
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLES.map(v => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setVehicle(v.id)}
                      className={`text-left p-3 rounded-md border transition ${
                        vehicle === v.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-bold text-sm">{v.name}</div>
                      <div className="text-[11px] text-muted-foreground">{v.pax}</div>
                      <div className="text-sm font-mono mt-1">${v.price}</div>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Notes for driver">
                <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input resize-none" />
              </Field>

              <button
                type="submit"
                disabled={!arrival}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 transition"
              >
                {arrival ? "Confirm Booking" : "Select a flight first"}
              </button>
            </form>
          </section>
        </div>
      </main>
      <SiteFooter />

      <style>{`
        .input {
          width: 100%;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 30%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}{required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  );
}
