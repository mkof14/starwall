/** Flip a leading or trailing → / ← in RTL without mirroring the sentence. */
export function RtlAwareLabel({ text }: { text: string }) {
  const trailing = text.match(/^(.*)(\s+)([→←])\s*$/);
  if (trailing) {
    return (
      <>
        {trailing[1]}
        {trailing[2]}
        <span className="inline-block rtl:-scale-x-100" aria-hidden>
          {trailing[3]}
        </span>
      </>
    );
  }

  const leading = text.match(/^([←→])(\s+)(.*)$/);
  if (leading) {
    return (
      <>
        <span className="inline-block rtl:-scale-x-100" aria-hidden>
          {leading[1]}
        </span>
        {leading[2]}
        {leading[3]}
      </>
    );
  }

  return <>{text}</>;
}
