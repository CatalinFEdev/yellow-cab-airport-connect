import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-secondary text-secondary-foreground border-b-4 border-primary">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center font-display text-2xl text-primary-foreground">
            Y
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-wide">YELLOW WING</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Airport Taxi</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/order" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Book a Ride</Link>
        </nav>
        <Link
          to="/order"
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold text-sm uppercase tracking-wider hover:brightness-95 transition"
        >
          Book Now
        </Link>
      </div>
      <div className="h-2 taxi-stripe" />
    </header>
  );
}
