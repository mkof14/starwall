"use client";

import { useEffect, useState } from "react";

function formatUtc(date: Date) {
  return date.toISOString().slice(11, 19);
}

export function UtcClock() {
  const [time, setTime] = useState("——:——:——");

  useEffect(() => {
    const tick = () => setTime(formatUtc(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="font-mono text-sm text-bridge-text">{time}</span>;
}
