"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useBridgeSession } from "@/lib/bridge-session";

type MicState = "idle" | "listening" | "processing" | "speaking";

type ChatMessage = {
  id: number;
  role: "user" | "assistant" | "error";
  text: string;
};

const RECOGNITION_LANGS = [
  { id: "en-US", label: "EN", title: "English", flag: "🇬🇧" },
  { id: "ru-RU", label: "RU", title: "Russian", flag: "🇷🇺" },
  { id: "fr-FR", label: "FR", title: "French", flag: "🇫🇷" },
  { id: "it-IT", label: "IT", title: "Italian", flag: "🇮🇹" },
  { id: "ar-SA", label: "AR", title: "Arabic", flag: "🇸🇦" },
] as const;

const SPEAK_LANG: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  fr: "fr-FR",
  it: "it-IT",
  ar: "ar-SA",
  de: "de-DE",
  es: "es-ES",
};

const BAR_COUNT = 8;
const TYPE_MS = 35;

function SpeechEngine() {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function StarWallAssistant() {
  const session = useBridgeSession();
  const [open, setOpen] = useState(true);
  const [mic, setMic] = useState<MicState>("idle");
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));
  const [recogLang, setRecogLang] = useState<(typeof RECOGNITION_LANGS)[number]["id"]>(
    "en-US",
  );
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typed, setTyped] = useState("");
  const [typingId, setTypingId] = useState<number | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
      recognition.lang = recogLang;
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
          },
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        langCode?: string;
        error?: string;
      };
      if (!response.ok || !data.reply) {
        const errorId = nextId.current++;
        setMessages((current) => [
          ...current,
          {
            id: errorId,
            role: "error",
            text: data.error ?? "The assistant could not reply.",
          },
        ]);
        setMic("idle");
        return;
      }
      const assistantId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", text: data.reply ?? "" },
      ]);
      setTypingId(assistantId);
      speakReply(data.reply, data.langCode ?? "en");
    } catch {
      const errorId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: errorId, role: "error", text: "Network error — try again." },
      ]);
      setMic("idle");
    }
  }

  return (
    <div
      data-testid="starwall-assistant"
      className="fixed bottom-4 right-4 z-[70] w-[min(24rem,calc(100vw-2rem))] font-ui"
    >
      {open ? (
        <section className="border border-bridge-line bg-bridge-panel shadow-xl">
          <header className="flex items-center justify-between gap-2 border-b border-bridge-line px-3 py-2">
            <div>
              <p className="font-ui text-sm font-semibold text-bridge-text">
                StarWall Assistant
              </p>
              <p className="font-mono text-[10px] text-bridge-dim">
                {session.vessel} · {session.riskLevel} · {session.scenarioName}
              </p>
            </div>
            <button
              type="button"
              data-testid="assistant-toggle"
              onClick={() => setOpen(false)}
              className="border border-bridge-line px-2 py-1 font-mono text-[10px] text-bridge-dim hover:text-bridge-text"
            >
              Hide
            </button>
          </header>

          <div className="flex flex-wrap gap-1 px-3 py-2">
            {RECOGNITION_LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.title}
                aria-pressed={recogLang === item.id}
                onClick={() => setRecogLang(item.id)}
                className={cn(
                  "border px-1.5 py-0.5 font-mono text-[10px]",
                  recogLang === item.id
                    ? "border-ok bg-ok/15 text-ok"
                    : "border-bridge-line text-bridge-dim hover:text-bridge-text",
                )}
              >
                {item.flag} {item.label}
              </button>
            ))}
          </div>

          <div
            ref={listRef}
            data-testid="assistant-chat"
            className="h-56 space-y-2 overflow-y-auto px-3 py-2"
          >
            {messages.length === 0 ? (
              <p className="text-xs text-bridge-dim">
                Ask about the current picture — speak or type. Advice only; you
                decide.
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
                        : "bg-bridge-bg text-bridge-text",
                  )}
                >
                  {showing}
                </div>
              );
            })}
          </div>

          <div className="border-t border-bridge-line px-3 py-2">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                data-testid="assistant-mic"
                onClick={() => void toggleMic()}
                className={cn(
                  "flex h-9 w-9 items-center justify-center border",
                  mic === "idle" && "border-bridge-line text-bridge-dim",
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
                    className="flex-1 bg-ok"
                    style={{
                      height: `${Math.max(12, level * 100)}%`,
                      opacity: mic === "listening" ? Math.max(0.25, level) : 0.2,
                    }}
                  />
                ))}
              </div>
              <span className="w-16 text-end font-mono text-[10px] uppercase text-bridge-dim">
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
                placeholder="Type a question…"
                className="min-w-0 flex-1 border border-bridge-line bg-bridge-bg px-2 py-1.5 font-ui text-sm text-bridge-text outline-none focus:border-orange"
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
          className="border border-bridge-line bg-bridge-panel px-3 py-2 font-ui text-sm text-bridge-text shadow-xl hover:border-orange"
        >
          StarWall Assistant
        </button>
      )}
    </div>
  );
}
