import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Plane, Clock, ShieldCheck, BadgeDollarSign } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yellow Wing — Airport Taxi & Transfers" },
      { name: "description", content: "Reliable airport taxi service with flight tracking, fixed rates and 24/7 dispatch." },
      { property: "og:title", content: "Yellow Wing — Airport Taxi" },
      { property: "og:description", content: "Reliable airport taxi service with flight tracking and fixed rates." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <div className="absolute inset-0 opacity-10 taxi-stripe" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">
              24/7 Airport Transfers
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-none">
              Land. <span className="text-primary">Ride.</span><br />Arrive.
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80 max-w-md">
              Pre-book your airport taxi in under a minute. We track your flight and meet you at arrivals — even if you're early or late.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/order" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold uppercase tracking-wider hover:brightness-95 transition">
                Book a Transfer
              </Link>
              <a href="tel:+18005552221" className="border border-primary text-primary px-6 py-3 rounded-md font-semibold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition">
                Call Dispatch
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-3xl bg-primary flex items-center justify-center shadow-glow">
              <Plane className="w-48 h-48 text-secondary" strokeWidth={1.2} />
            </div>
            <div className="absolute -bottom-4 -left-4 h-16 w-16 taxi-stripe rounded-md" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Plane, title: "Flight Tracking", desc: "We monitor your arrival in real time and adjust pickup automatically." },
          { icon: BadgeDollarSign, title: "Fixed Rates", desc: "No surge pricing. Know your fare the moment you book." },
          { icon: ShieldCheck, title: "Vetted Drivers", desc: "Licensed, insured and professional chauffeurs only." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-display text-xl">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Strip */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Clock className="w-10 h-10" />
            <div>
              <div className="font-display text-2xl">Dispatch is open right now</div>
              <div className="text-sm opacity-80">Average response under 90 seconds.</div>
            </div>
          </div>
          <Link to="/order" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-semibold uppercase tracking-wider hover:opacity-90 transition">
            Book your ride
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
