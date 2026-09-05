type PageIntroProps = {
  eyebrow?: string;
  title: string;
  lede: string;
};

export function PageIntro({ eyebrow, title, lede }: PageIntroProps) {
  return (
    <header className="max-w-3xl space-y-4">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.2em] text-orange">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-serif text-4xl text-sand text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="text-base leading-relaxed text-sand/70 sm:text-lg">{lede}</p>
    </header>
  );
}
