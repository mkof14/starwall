"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { cn } from "@/lib/cn";
import { useBlackBox } from "@/lib/black-box";
import { useBridgeSession } from "@/lib/bridge-session";
import { syncConversationToCloud } from "@/lib/cloud-sync";
import { HELM_OPEN_EVENT, publishHelmState } from "@/lib/helm-events";
import { DEMO_CLEARED_EVENT } from "@/lib/demo-storage";
import { listConversations, putConversation, type StoredConversation } from "@/lib/local-db";
import { isAuthRoute, useAuthSession } from "@/lib/auth-session";
import { canUseHelm } from "@/lib/rbac";
import { useHud } from "@/lib/i18n/use-hud";
import { localeMeta, locales, type Locale } from "@/lib/i18n/locales";
import { useAppMode } from "@/lib/mode";
import { usePathname } from "next/navigation";

type MicState = "idle" | "listening" | "processing" | "speaking";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
};

function messageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `helm-${crypto.randomUUID()}`;
  }
  return `helm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

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

const BAR_COUNT = 10;
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
  const pathname = usePathname();
  const session = useBridgeSession();
  const { session: auth } = useAuthSession();
  const helmAllowed = !auth || canUseHelm(auth.role);
  const { live } = useAppMode();
  const { t, locale, hud } = useHud();
  const { recordConversation } = useBlackBox();
  const surface = t.surface;
  const [open, setOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const [mic, setMic] = useState<MicState>("idle");
  const [voiceOn, setVoiceOn] = useState(true);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));
  const [recogLang, setRecogLang] = useState<Locale>(locale);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typed, setTyped] = useState("");
  const [typingId, setTypingId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
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
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(HELM_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HELM_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    setRecogLang(locale);
  }, [locale]);

  useEffect(() => {
    publishHelmState(open);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    void listConversations()
      .then((rows) => {
        if (cancelled || !rows.length) return;
        setMessages(
          rows.map((row) => ({
            id: row.id,
            role: row.role,
            text: row.content,
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (live) {
      setMessages([]);
      setTyped("");
      setTypingId(null);
    }
  }, [live]);

  useEffect(() => {
    function onCleared() {
      setMessages([]);
      setTyped("");
      setTypingId(null);
    }
    window.addEventListener(DEMO_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(DEMO_CLEARED_EVENT, onCleared);
  }, []);

  function persistChat(row: StoredConversation) {
    void putConversation(row).catch(() => undefined);
    if (row.role !== "error") {
      void syncConversationToCloud(row, session.vessel).catch(() => undefined);
    }
  }

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
      setMicError(hud.helm.noSpeech);
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
        setMicError(hud.helm.micStopped);
      };
      recognition.onend = () => {
        stopMeter();
        setMic((current) => (current === "listening" ? "idle" : current));
      };
      recognition.start();
    } catch {
      setMicError(hud.helm.micDenied);
      stopListening(true);
      setMic("idle");
    }
  }

  function stopSpeech() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMic((current) => (current === "speaking" ? "idle" : current));
  }

  function toggleSpeaker() {
    setVoiceOn((current) => {
      if (current) stopSpeech();
      return !current;
    });
  }

  function speakReply(text: string, langCode: string) {
    if (!voiceOn || typeof window === "undefined" || !window.speechSynthesis) {
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
    const userId = messageId();
    const userAt = new Date().toISOString();
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: clean },
    ]);
    persistChat({
      id: userId,
      timestamp: userAt,
      role: "user",
      content: clean,
      langCode: recogLang,
    });
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
        const errorText = data.error ?? hud.helm.noReply;
        const errorId = messageId();
        setMessages((current) => [
          ...current,
          { id: errorId, role: "error", text: errorText },
        ]);
        persistChat({
          id: errorId,
          timestamp: new Date().toISOString(),
          role: "error",
          content: errorText,
          langCode: recogLang,
        });
        recordConversation({
          summary: `Pilot exchange — ${clean.slice(0, 72)}`,
          fullContent: `Officer: ${clean}\n\nPilot: ${errorText}`,
        });
        setMic("idle");
        return;
      }
      const assistantId = messageId();
      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", text: data.reply ?? "" },
      ]);
      persistChat({
        id: assistantId,
        timestamp: new Date().toISOString(),
        role: "assistant",
        content: data.reply ?? "",
        langCode: data.langCode ?? recogLang,
      });
      recordConversation({
        summary: `Pilot exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nPilot: ${data.reply}`,
      });
      setTypingId(assistantId);
      speakReply(data.reply, data.langCode ?? "en");
    } catch {
      const errorId = messageId();
      setMessages((current) => [
        ...current,
          { id: errorId, role: "error", text: hud.helm.network },
      ]);
      persistChat({
        id: errorId,
        timestamp: new Date().toISOString(),
        role: "error",
        content: hud.helm.network,
        langCode: recogLang,
      });
      recordConversation({
        summary: `Pilot exchange — ${clean.slice(0, 72)}`,
        fullContent: `Officer: ${clean}\n\nPilot: Network error — try again.`,
      });
      setMic("idle");
    }
  }

  if (isAuthRoute(pathname) || !helmAllowed) return null;

  return (
    <div
      data-testid="starwall-assistant"
      className="fixed bottom-4 end-4 z-[70] font-ui"
    >
      {open ? (
        <section className="helm-scope flex h-[min(42rem,calc(100vh-5.5rem))] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden border border-stroke bg-[#0b141c] text-sand shadow-[0_20px_56px_rgb(15_25_34/0.38)]">
          <div className="h-[2px] bg-orange" />
          <header className="relative flex items-center justify-between gap-2 border-b border-sand/15 bg-[#061018] px-3 py-2.5">
            <span
              className="helm-fab-sweep pointer-events-none absolute -end-6 -top-10 h-28 w-28 rounded-full opacity-40"
              style={{
                background:
                  "conic-gradient(from 200deg, transparent 0deg, transparent 300deg, rgb(241 90 0 / 0.45) 360deg)",
              }}
              aria-hidden
            />
            <div className="relative min-w-0">
              <p className="flex items-center gap-2 font-heading text-xl font-bold text-sand">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    mic === "listening"
                      ? "bg-ok assistant-mic-listen"
                      : mic === "speaking"
                        ? "bg-orange assistant-mic-speak"
                        : "bg-orange helm-idle-led",
                  )}
                />
                {surface.helmTitle}
              </p>
              <p className="truncate font-mono text-[10px] text-sand/55">
                {live
                  ? surface.helmLive
                  : `${surface.helmAdvisor} · ${session.vessel} · ${session.riskLevel}`}
              </p>
            </div>
            <div className="relative flex items-center gap-1.5">
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  data-testid="helm-lang-toggle"
                  aria-expanded={langsOpen}
                  aria-controls={menuId}
                  aria-label={hud.helm.language}
                  title={hud.helm.language}
                  onClick={() => setLangsOpen((value) => !value)}
                  className="inline-flex items-center gap-1.5 border border-sand/20 px-2 py-1 font-mono text-[10px] text-sand hover:border-orange"
                >
                  <FlagIcon locale={recogLang} />
                  {recogLang.toUpperCase()}
                  <span aria-hidden>▾</span>
                </button>
                {langsOpen ? (
                  <ul
                    id={menuId}
                    className="absolute end-0 z-20 mt-1 max-h-64 min-w-[11rem] overflow-auto border border-stroke bg-panel py-1 text-ink shadow-lg"
                  >
                    {locales.map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-2 px-2.5 py-1.5 text-start text-xs",
                            code === recogLang
                              ? "text-orange"
                              : "text-ink hover:bg-page",
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
                className="border border-sand/20 px-2 py-1 font-mono text-[10px] text-sand/70 hover:text-sand"
              >
                {surface.helmHide}
              </button>
            </div>
          </header>

          <div
            ref={listRef}
            data-testid="assistant-chat"
            className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
          >
            {messages.length === 0 ? (
              <p className="border-s-2 border-orange ps-3 text-xs leading-relaxed text-sand/65">
                {surface.helmEmpty}
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
                    "max-w-[92%] px-2.5 py-2 text-sm leading-relaxed",
                    item.role === "user"
                      ? "ms-auto bg-orange text-white"
                      : item.role === "error"
                        ? "border border-attn text-attn"
                        : "border-s-2 border-ok bg-[#111820] text-sand",
                  )}
                >
                  {showing}
                </div>
              );
            })}
          </div>

          <div className="border-t border-sand/15 bg-[#061018] px-3 py-3">
            <div className="mb-3 flex items-end gap-2">
              <button
                type="button"
                data-testid="assistant-mic"
                onClick={() => void toggleMic()}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border",
                  mic === "listening" && "assistant-mic-listen border-ok text-ok",
                  mic === "processing" && "border-attn text-attn",
                  mic === "speaking" && "assistant-mic-speak border-orange text-orange",
                  mic === "idle" && "border-sand/25 text-sand/70 hover:text-sand",
                )}
                aria-label={
                  mic === "listening" ? hud.helm.listenStop : hud.helm.listenStart
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
              <button
                type="button"
                data-testid="assistant-speaker"
                onClick={toggleSpeaker}
                aria-pressed={!voiceOn}
                aria-label={voiceOn ? surface.helmSpeakerOn : surface.helmSpeakerOff}
                title={voiceOn ? surface.helmSpeakerOn : surface.helmSpeakerOff}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border",
                  voiceOn
                    ? "border-sand/25 text-sand hover:border-orange"
                    : "border-attn text-attn",
                )}
              >
                {voiceOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
              </button>
              <div
                data-testid="assistant-vu"
                className="flex h-10 min-w-0 flex-1 items-end gap-px border-s-2 border-orange/70 ps-2"
                title="Sound"
                aria-hidden
              >
                {levels.map((level, index) => (
                  <span
                    key={index}
                    className={cn(
                      "w-1.5",
                      mic === "speaking" ? "bg-orange" : "bg-ok",
                    )}
                    style={{
                      height: `${Math.max(16, (mic === "idle" ? 0.2 + (index % 2) * 0.16 : level) * 100)}%`,
                      opacity:
                        mic === "listening" || mic === "speaking"
                          ? Math.max(0.4, level)
                          : 0.28,
                    }}
                  />
                ))}
              </div>
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
                placeholder={surface.helmAsk}
                className="min-w-0 flex-1 border-b border-sand/25 bg-transparent px-0 py-1.5 font-ui text-sm text-sand outline-none placeholder:text-sand/40 focus:border-orange"
              />
              <button
                type="submit"
                data-testid="assistant-send"
                className="bg-orange px-3 py-1.5 font-ui text-xs font-medium text-white hover:bg-orange/90"
              >
                {surface.helmSend}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          data-testid="assistant-toggle"
          onClick={() => setOpen(true)}
          aria-label={surface.helmOpen}
          className="helm-fab relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-orange bg-navy text-orange"
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

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M2.2 5.6h2.2L7.8 3.2v9.6L4.4 10.4H2.2A.8.8 0 0 1 1.4 9.6V6.4a.8.8 0 0 1 .8-.8Zm8 5.1a3.6 3.6 0 0 0 0-5.4l1.1-1.1a5.2 5.2 0 0 1 0 7.6L10.2 10.7Zm1.9 1.9a6.4 6.4 0 0 0 0-9.2L13.2 2.3a8 8 0 0 1 0 11.4l-1.1-1.1Z"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M2.2 5.6h2.2L7.8 3.2v9.6L4.4 10.4H2.2A.8.8 0 0 1 1.4 9.6V6.4a.8.8 0 0 1 .8-.8ZM3.2 2.3 14.1 13.2l-1.1 1.1-2.1-2.1A6.3 6.3 0 0 1 9.4 14l-1-1.3a4.8 4.8 0 0 0 1.3-1.3L3.2 5l-1.1-1.1L3.2 2.3Zm8.1 2.2 1.1-1.1a8 8 0 0 1 1.8 7.2L12.9 9.3a6.3 6.3 0 0 0-1.6-4.8Z"
      />
    </svg>
  );
}

export const StarWallAssistant = Helm;
