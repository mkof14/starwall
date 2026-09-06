"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useBlackBox, type BlackBoxRecord, type StorageLocation } from "@/lib/black-box";

function MicIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ok" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-orange" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.2 1.2 13.4h13.6L8 1.2Zm0 3.4.2 5.2H7.8L8 4.6Zm0 6.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9Z"
      />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
      <path
        fill="currentColor"
        d="M2 4.2h12v7.6H2V4.2Zm1.3 1.3v5h9.4v-5H3.3Zm7.4 3.2a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
      <path
        fill="currentColor"
        d="M5.2 12.4h6.3A3.3 3.3 0 0 0 13.4 6.2 3.8 3.8 0 0 0 6.3 4.5 3.2 3.2 0 0 0 5.2 12.4Z"
      />
    </svg>
  );
}

function storageLabel(location: StorageLocation) {
  if (location === "local") return "Local";
  if (location === "cloud") return "Cloud";
  return "Local + Cloud";
}

function formatStamp(iso: string) {
  return `${iso.slice(0, 10)} · ${iso.slice(11, 19)} UTC`;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function downloadRecord(record: BlackBoxRecord) {
  const blob = new Blob([record.fullContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `starwall-black-box-${record.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function BlackBoxPanel() {
  const { records } = useBlackBox();
  const [openId, setOpenId] = useState<string | null>(null);
  const [printRecord, setPrintRecord] = useState<BlackBoxRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function shareRecord(record: BlackBoxRecord) {
    // Illustrative only — no sharing backend. Copies a lookalike review link.
    void copyText(`https://starwall.agron.example/review/${record.id}`).then(() => {
      flash("Link copied");
    });
  }

  return (
    <div className="bg-bridge-bg px-4 pb-10 md:px-6">
      <section
        data-testid="black-box-panel"
        className="relative mx-auto max-w-6xl border border-bridge-line bg-bridge-panel p-4 text-bridge-text"
      >
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-orange" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-orange" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-orange" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-orange" />

        <header className="mb-3">
          <h2 className="font-ui text-sm font-semibold tracking-wide">BLACK BOX</h2>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-bridge-dim">
            All sessions are retained for review — StarWall records locally and
            syncs to cloud storage for redundancy, so no record depends on a
            single point of failure.
          </p>
        </header>

        {records.length === 0 ? (
          <p className="font-mono text-xs text-bridge-dim">
            No records yet this session — run a scenario or talk to the
            assistant.
          </p>
        ) : (
          <ul className="space-y-2">
            {records.map((record) => {
              const expanded = openId === record.id;
              return (
                <li
                  key={record.id}
                  className="border border-bridge-line bg-bridge-bg"
                >
                  <button
                    type="button"
                    data-testid={`black-box-row-${record.id}`}
                    onClick={() =>
                      setOpenId((current) =>
                        current === record.id ? null : record.id,
                      )
                    }
                    className="flex w-full items-start gap-3 px-3 py-2.5 text-left"
                  >
                    <span className="mt-0.5">
                      {record.type === "conversation" ? <MicIcon /> : <AlertIcon />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] text-bridge-dim">
                        {formatStamp(record.timestamp)}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-bridge-text">
                        {record.summary}
                      </span>
                    </span>
                    <span
                      className="flex shrink-0 items-center gap-1 border border-bridge-line px-1.5 py-0.5 font-mono text-[10px] text-bridge-dim"
                      data-testid={`black-box-storage-${record.id}`}
                    >
                      {(record.storageLocation === "local" ||
                        record.storageLocation === "both") && <DriveIcon />}
                      {(record.storageLocation === "cloud" ||
                        record.storageLocation === "both") && <CloudIcon />}
                      {storageLabel(record.storageLocation)}
                    </span>
                  </button>

                  {expanded ? (
                    <div
                      data-testid={`black-box-detail-${record.id}`}
                      className="border-t border-bridge-line px-3 py-3"
                    >
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-bridge-text">
                        {record.fullContent}
                      </pre>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          data-testid="black-box-copy"
                          onClick={() => {
                            void copyText(record.summary).then(() =>
                              flash("Copied"),
                            );
                          }}
                          className="border border-bridge-line px-2.5 py-1 font-ui text-xs hover:border-orange"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          data-testid="black-box-print"
                          onClick={() => setPrintRecord(record)}
                          className="border border-bridge-line px-2.5 py-1 font-ui text-xs hover:border-orange"
                        >
                          Print
                        </button>
                        <button
                          type="button"
                          data-testid="black-box-download"
                          onClick={() => {
                            downloadRecord(record);
                            flash("Download started");
                          }}
                          className="border border-bridge-line px-2.5 py-1 font-ui text-xs hover:border-orange"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          data-testid="black-box-share"
                          onClick={() => shareRecord(record)}
                          className="border border-bridge-line px-2.5 py-1 font-ui text-xs hover:border-orange"
                        >
                          Share
                        </button>
                        <button
                          type="button"
                          data-testid="black-box-pdf"
                          disabled={!record.pdfEnabled}
                          title={
                            record.pdfEnabled
                              ? "Print / Save as PDF"
                              : "Not available for this file type"
                          }
                          onClick={() => {
                            if (record.pdfEnabled) setPrintRecord(record);
                          }}
                          className={cn(
                            "border px-2.5 py-1 font-ui text-xs",
                            record.pdfEnabled
                              ? "border-bridge-line hover:border-orange"
                              : "cursor-not-allowed border-bridge-line/40 text-bridge-dim",
                          )}
                        >
                          PDF
                        </button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        {toast ? (
          <p
            data-testid="black-box-toast"
            className="mt-3 border border-ok/40 bg-ok/10 px-3 py-1.5 font-mono text-[11px] text-ok"
          >
            {toast}
          </p>
        ) : null}
      </section>

      {printRecord ? (
        <div
          id="black-box-print"
          data-testid="black-box-print"
          className="fixed inset-0 z-[80] overflow-y-auto bg-[#f7f5f0] text-navyText"
        >
          <div className="session-report-chrome mx-auto flex max-w-3xl justify-end gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-orange px-3 py-1.5 font-ui text-sm font-medium text-white"
            >
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={() => setPrintRecord(null)}
              className="border border-navyText/30 px-3 py-1.5 font-ui text-sm"
            >
              Close
            </button>
          </div>
          <article className="session-report-page mx-auto max-w-3xl bg-white px-8 py-10">
            <p className="font-mono text-xs tracking-wider text-[#6B7280]">
              STARWALL BLACK BOX
            </p>
            <h1 className="mt-2 font-ui text-2xl font-bold">
              {printRecord.type === "conversation"
                ? "Conversation transcript"
                : "Scenario record"}
            </h1>
            <p className="mt-2 font-mono text-xs text-[#6B7280]">
              {formatStamp(printRecord.timestamp)} · {storageLabel(printRecord.storageLocation)}
            </p>
            <p className="mt-4 text-sm font-semibold">{printRecord.summary}</p>
            <pre className="mt-4 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {printRecord.fullContent}
            </pre>
          </article>
        </div>
      ) : null}
    </div>
  );
}
