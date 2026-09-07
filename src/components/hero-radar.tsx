export function HeroRadar() {
  return (
    <div className="hero-radar-scope mx-auto w-full max-w-[22rem]" aria-hidden>
      <div className="relative aspect-square bg-[#061018] p-[1.15rem] shadow-[inset_0_0_0_1px_rgb(241_90_0/0.45),0_22px_48px_rgb(15_25_34/0.28)]">
        <span className="absolute left-2 top-2 h-2 w-2 border-l border-t border-sand/40" />
        <span className="absolute right-2 top-2 h-2 w-2 border-r border-t border-sand/40" />
        <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-sand/40" />
        <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-sand/40" />
        <div className="hero-radar relative h-full w-full overflow-hidden rounded-full border border-[#1c4036] bg-[#03140c]">
          <div className="hero-radar-glow pointer-events-none absolute inset-0" />
          <div className="absolute inset-[18%] rounded-full border border-orange/30" />
          <div className="absolute inset-[36%] rounded-full border border-ok/25" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ok/20" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ok/20" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
          <div className="hero-radar-blip absolute h-1.5 w-1.5 rounded-full bg-ok" />
          <div className="hero-radar-sweep absolute inset-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
