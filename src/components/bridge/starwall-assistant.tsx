"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { cn } from "@/lib/cn";
import { useBlackBox } from "@/lib/black-box";
import { useBridgeSession } from "@/lib/bridge-session";
import { localeMeta, locales, type Locale } from "@/lib/i18n/locales";
import { useAppMode } from "@/lib/mode";

type MicState = "idle" | "listening" | "processing" | "speaking";

type ChatMessage = {
  id: number;
  role: "user" | "assistant" | "error";
  text: string;
};

const SPEAK_LANG: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  uk: "uk-UA",
  ar: "ar-SA",
  zh: "zh-CN",
  ja: "ja-JP",
  he: "he-IL",
};

const BAR_COUNT = 8;
const TYPE_MS = 28;

function SpeechEngine() {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function Helm() {
  const session = useBridgeSession();
  const { live } = useAppMode();
  const { recordConversation } = useBlackBox();
  const [open, setOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const [mic, setMic] = useState<MicState>("idle");
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));
  const [recogLang, setRecogLang] = useState<Locale>("en");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typed, setTyped] = useState("");
  const [typingId, setTypingId] = useState<number | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typed, open]);

  useEffect(() => {
    if (typingId === null) return;
    const target = messages.find((item) => item.id === typingId);
    if (!target) return;
    setTyped("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(target.text.slice(0, index));
      if (index >= target.text.length) {
        window.clearInterval(timer);
        setTypingId(null);
      }
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [typingId, messages]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !langRef.current?.contains(event.target)
      ) {
        setLangsOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioRef.current) void audioRef.current.close();
    };
  }, []);

  function stopMeter() {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLevels(Array(BAR_COUNT).fill(0));
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) {
      void audioRef.current.close();
      audioRef.current = null;
    }
  }

  function stopListening(silent = false) {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopMeter();
    if (!silent) setMic((current) => (current === "listening" ? "idle" : current));
  }

  function startMeter(stream: MediaStream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    audioRef.current = context;
    const samples = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i += 1) {
        const centered = (samples[i] - 128) / 128;
        sum += centered * centered;
      }
      const rms = Math.sqrt(sum / samples.length);
      const lit = Math.min(BAR_COUNT, Math.round(rms * 28));
      setLevels(Array.from({ length: BAR_COUNT }, (_, i) => (i < lit ? 1 : 0.18)));
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }

  async function toggleMic() {
    if (mic === "listening") {
      stopListening();
      return;
    }
    if (mic === "processing" || mic === "speaking") return;

    const Engine = SpeechEngine();
    if (!Engine) {
      setMicError("This browser has no Speech Recognition. Type instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startMeter(stream);
      setMicError(null);
      setMic("listening");

      const recognition = new Engine();
      recognition.lang = SPEAK_LANG[recogLang] ?? "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const last = event.results[event.results.length - 1];
        if (!last?.isFinal) return;
        const said = last[0]?.transcript?.trim();
        if (said) void sendMessage(said);
      };
      recognition.onerror = () => {
        stopListening();
        setMicError("Microphone recognition stopped. You can type instead.");
      };
      recognition.onend = () => {
        stopMeter();
        setMic((current) => (current === "listening" ? "idle" : current));
      };
      recognition.start();
    } catch {
      setMicError("Microphone permission was denied. Type instead.");
      stopListening(true);
      setMic("idle");
    }
  }

  function speakReply(text: string, langCode: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setMic("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEAK_LANG[langCode] ?? langCode;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase()),
    );
    if (match) utterance.voice = match;
    utterance.onend = () => setMic("idle");
    utterance.onerror = () => setMic("idle");
    setMic("speaking");
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean) return;
    stopListening(true);
    const userId = nextId.current++;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: clean },
    ]);
    setDraft("");
    setMic("processing");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          context: {
            scenarioName: session.scenarioName,
            riskLevel: session.riskLevel,
            vessel: session.vessel,
            mode: live ? "live" : "demo",
          },
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        langCode?: string;
        error?: string;
      };
      if (!response.ok || !data.reply) {
        const errorText = data.error ?? "Helm could not reply.";
        const errorId = nextId.current++;
        setMessages((current) => [
          ...current,
          { id: errorId, role: "error", text: errorText },
        ]);
        recordConversation({
          summary: `Helm exchange — ${clean.slice(0, 72)}`,
          fullContent: `Officer: ${clean}\n\nHelm: ${errorText}`,
        });
        setMic("idle");
        return;
      }
      const assistantId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", text: data.reply ?? "" },
      ]);
      recordConversation({
        summary: `Helm exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nHelm: ${data.reply}`,
      });
      setTypingId(assistantId);
      speakReply(data.reply, data.langCode ?? "en");
    } catch {
      const errorId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: errorId, role: "error", text: "Network error — try again." },
      ]);
      recordConversation({
        summary: `Helm exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nHelm: Network error — try again.`,
      });
      setMic("idle");
    }
  }

  return (
    <div
      data-testid="starwall-assistant"
      className="fixed bottom-4 right-4 z-[70] font-ui"
    >
      {open ? (
        <section className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden border border-[#2A3A48] bg-[#111820] shadow-[0_12px_40px_rgb(0_0_0/0.45)]">
          <header className="flex items-center justify-between gap-2 border-b border-[#2A3A48] bg-[#0A0F14] px-3 py-2">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-ui text-sm font-semibold text-[#E7ECEF]">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    mic === "listening"
                      ? "bg-ok assistant-mic-listen"
                      : mic === "speaking"
                        ? "bg-orange assistant-mic-speak"
                        : "bg-orange helm-idle-led",
                  )}
                />
                Helm
              </p>
              <p className="truncate font-mono text-[10px] text-[#7C8894]">
                {live
                  ? "WATCH ADVISOR · LIVE · no sensors"
                  : `WATCH ADVISOR · ${session.vessel} · ${session.riskLevel}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  data-testid="helm-lang-toggle"
                  aria-expanded={langsOpen}
                  aria-controls={menuId}
                  onClick={() => setLangsOpen((value) => !value)}
                  className="inline-flex items-center gap-1.5 border border-[#2A3A48] px-2 py-1 font-mono text-[10px] text-[#E7ECEF] hover:border-orange"
                >
                  <FlagIcon locale={recogLang} />
                  {recogLang.toUpperCase()}
                  <span aria-hidden>▾</span>
                </button>
                {langsOpen ? (
                  <ul
                    id={menuId}
                    className="absolute end-0 z-20 mt-1 max-h-64 min-w-[11rem] overflow-auto border border-[#2A3A48] bg-[#0A0F14] py-1 shadow-lg"
                  >
                    {locales.map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2 px-2.5 py-1.5 text-start text-xs",
                            code === recogLang
                              ? "text-orange"
                              : "text-[#E7ECEF] hover:bg-white/5",
                          )}
                          onClick={() => {
                            setRecogLang(code);
                            setLangsOpen(false);
                          }}
                        >
                          <FlagIcon locale={code} />
                          {localeMeta[code].native}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button
                type="button"
                data-testid="assistant-toggle"
                onClick={() => setOpen(false)}
                className="border border-[#2A3A48] px-2 py-1 font-mono text-[10px] text-[#7C8894] hover:text-[#E7ECEF]"
              >
                Hide
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            data-testid="assistant-chat"
            className="h-56 space-y-2 overflow-y-auto px-3 py-2"
          >
            {messages.length === 0 ? (
              <p className="text-xs text-[#7C8894]">
                Helm is on watch. Ask about the picture — speak or type. Advice
                only; you decide.
              </p>
            ) : null}
            {messages.map((item) => {
              const showing =
                item.role === "assistant" && typingId === item.id
                  ? typed
                  : item.text;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "max-w-[90%] px-2.5 py-1.5 text-sm",
                    item.role === "user"
                      ? "ms-auto bg-orange text-white"
                      : item.role === "error"
                        ? "border border-attn text-attn"
                        : "bg-[#0A0F14] text-[#E7ECEF]",
                  )}
                >
                  {showing}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#2A3A48] px-3 py-2">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                data-testid="assistant-mic"
                onClick={() => void toggleMic()}
                className={cn(
                  "flex h-9 w-9 items-center justify-center border",
                  mic === "idle" && "border-[#2A3A48] text-[#7C8894]",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "processing" && "border-attn text-attn",
                  mic === "speaking" && "assistant-mic-speak border-orange text-orange",
                )}
                aria-label={
                  mic === "listening" ? "Stop listening" : "Start listening"
                }
              >
                {mic === "processing" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-attn border-t-transparent" />
                ) : (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M8 1.5A2.2 2.2 0 0 0 5.8 3.7v3.1a2.2 2.2 0 1 0 4.4 0V3.7A2.2 2.2 0 0 0 8 1.5Zm-4 5.4a.7.7 0 0 0-1.4 0 5.4 5.4 0 0 0 4.7 5.3v1.6H6.1a.7.7 0 0 0 0 1.4h3.8a.7.7 0 0 0 0-1.4H8.7v-1.6A5.4 5.4 0 0 0 13.4 6.9a.7.7 0 0 0-1.4 0 4 4 0 0 1-8 0Z"
                    />
                  </svg>
                )}
              </button>
              <div
                data-testid="assistant-vu"
                className="flex h-8 flex-1 items-end gap-0.5"
                aria-hidden
              >
                {levels.map((level, index) => (
                  <span
                    key={index}
                    className={cn(
                      "flex-1",
                      mic === "speaking" ? "bg-orange" : "bg-ok",
                    )}
                    style={{
                      height: `${Math.max(12, (mic === "idle" ? 0.22 + (index % 3) * 0.08 : level) * 100)}%`,
                      opacity:
                        mic === "listening" || mic === "speaking"
                          ? Math.max(0.25, level)
                          : 0.28,
                    }}
                  />
                ))}
              </div>
              <span className="w-16 text-end font-mono text-[10px] uppercase text-[#7C8894]">
                {mic}
              </span>
            </div>
            {micError ? (
              <p className="mb-2 font-mono text-[10px] text-attn">{micError}</p>
            ) : null}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(draft);
              }}
              className="flex gap-2"
            >
              <input
                data-testid="assistant-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask Helm…"
                className="min-w-0 flex-1 border border-[#2A3A48] bg-[#0A0F14] px-2 py-1.5 font-ui text-sm text-[#E7ECEF] outline-none focus:border-orange"
              />
              <button
                type="submit"
                data-testid="assistant-send"
                className="bg-orange px-3 py-1.5 font-ui text-xs font-medium text-white hover:bg-orange/90"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          data-testid="assistant-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open Helm"
          className="helm-fab relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-orange bg-[#0A0F14] text-orange"
        >
          <span
            className="helm-fab-sweep pointer-events-none absolute inset-1 rounded-full"
            style={{
              background:
                "conic-gradient(from 200deg, transparent 0deg, transparent 300deg, rgb(241 90 0 / 0.5) 360deg)",
            }}
            aria-hidden
          />
          <svg viewBox="0 0 48 48" className="relative h-8 w-8" aria-hidden>
            <polygon
              points="24,5 41,14.5 41,33.5 24,43 7,33.5 7,14.5"
              fill="#111820"
              stroke="#F15A00"
              strokeWidth="1.8"
            />
            <circle cx="24" cy="24" r="3.2" fill="#F15A00" className="helm-idle-led" />
          </svg>
        </button>
      )}
    </div>
  );
}

export const StarWallAssistant = Helm;
