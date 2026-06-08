export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="h-2 taxi-stripe" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-2xl text-primary">YELLOW WING</div>
          <p className="mt-2 text-sm text-secondary-foreground/70">
            24/7 airport transfers with fixed rates and flight tracking.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg text-primary mb-3">Contact</h4>
          <p className="text-sm">+1 (800) 555-CAB1</p>
          <p className="text-sm">dispatch@yellowwing.taxi</p>
        </div>
        <div>
          <h4 className="font-display text-lg text-primary mb-3">Service Area</h4>
          <p className="text-sm">All major international airports.</p>
          <p className="text-sm">Pre-bookings 24h in advance.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/50">
        © {new Date().getFullYear()} Yellow Wing Airport Taxi. All rights reserved.
      </div>
    </footer>
  );
}
