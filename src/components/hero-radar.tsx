export function HeroRadar() {
  return (
    <div
      className="hero-radar relative mx-auto aspect-square w-56 max-w-full sm:w-64 lg:w-[22rem]"
      aria-hidden
    >
      <div className="hero-radar-glow pointer-events-none absolute -inset-6 rounded-full" />
      <div className="absolute inset-0 rounded-full border-2 border-ok/50 shadow-[0_18px_50px_rgb(15_25_34/0.18),0_0_40px_rgb(241_90_0/0.12)]" />
      <div className="absolute inset-[18%] rounded-full border border-orange/35" />
      <div className="absolute inset-[36%] rounded-full border border-ok/30" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ok/25" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ok/25" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange shadow-[0_0_16px_rgb(241_90_0/0.8)]" />
      <div className="hero-radar-blip absolute h-2 w-2 rounded-full bg-ok shadow-[0_0_10px_rgb(51_211_166/0.9)]" />
      <div className="hero-radar-sweep absolute inset-0 rounded-full" />
    </div>
  );
}
