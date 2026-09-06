export function LiveModeBanner() {
  return (
    <p
      data-testid="live-mode-banner"
      className="border-b border-[#2A3A48] bg-[#1B2A3A] px-4 py-2.5 font-mono text-[11px] leading-relaxed text-sand/85 md:px-6"
    >
      LIVE MODE — showing the real current state of this deployment. No
      equipment is connected yet. Switch to DEMO to see StarWall&apos;s full
      capability with simulated data.
    </p>
  );
}
