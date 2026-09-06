"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ExpandablePictureProps = {
  children: ReactNode;
};

export function ExpandablePicture({ children }: ExpandablePictureProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        data-testid="picture-expand"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="group relative cursor-zoom-in"
        aria-label="Open picture full screen"
      >
        {children}
        <span className="pointer-events-none absolute bottom-2 end-2 border border-white/20 bg-black/55 px-2 py-1 font-mono text-[10px] tracking-wider text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
          CLICK TO ENLARGE
        </span>
      </div>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              data-testid="picture-lightbox"
              className="fixed inset-0 z-[90] flex items-center justify-center bg-[#05080C]/92 p-3 md:p-8"
              onClick={() => setOpen(false)}
            >
              <div
                className="relative w-full max-w-6xl border border-[#2A3A48] bg-[#0A0F14] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#2A3A48] px-4 py-2">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-orange">
                    FULL PICTURE
                  </p>
                  <button
                    type="button"
                    data-testid="picture-collapse"
                    onClick={() => setOpen(false)}
                    className="border border-[#3A5166] px-2 py-1 font-mono text-[10px] text-[#E7ECEF] hover:border-orange hover:text-orange"
                  >
                    ESC · CLOSE
                  </button>
                </div>
                <div className="p-2 md:p-4">{children}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
