export function SiteFooter() {
  return (
    <footer className="w-full bg-navy">
      <div className="flex flex-col gap-2 px-4 py-6 text-[13px] text-sand/70 md:flex-row md:items-center md:justify-between md:px-6">
        <p>© AGRON Inc. 2026 · All rights reserved</p>
        <p>
          <a
            href="https://agron1.com"
            className="hover:text-sand"
          >
            agron1.com
          </a>
        </p>
      </div>
    </footer>
  );
}
