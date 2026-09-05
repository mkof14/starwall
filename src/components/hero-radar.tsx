export function HeroRadar() {
  return (
    <div
      className="hero-radar relative mx-auto aspect-square w-56 max-w-full opacity-60 sm:w-64 lg:w-80"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full border border-ok/25" />
      <div className="absolute inset-[18%] rounded-full border border-ok/20" />
      <div className="absolute inset-[36%] rounded-full border border-ok/15" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ok/10" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ok/10" />
      <div className="hero-radar-sweep absolute inset-0 rounded-full" />
    </div>
  );
}
