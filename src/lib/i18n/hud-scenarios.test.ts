import { describe, expect, it } from "vitest";
import { AUTOMATED_ACTIONS } from "@/lib/automated-actions";
import {
  CRISIS_PROTOCOLS,
  FALLBACK_CRISIS_STEPS,
} from "@/lib/crisis-protocols";
import { locales, type Locale } from "@/lib/i18n/locales";
import { SCENARIOS } from "@/lib/scenarios";
import {
  localizeAutoActions,
  localizeCrisisSteps,
  localizeScenario,
} from "@/lib/i18n/hud-scenarios";

const IDS = [
  "recon-drone",
  "payload-drone",
  "drone-swarm",
  "loitering-drone",
  "converging-vessel",
  "vessel-no-ais",
  "usv-swarm",
  "critical-closing-speed",
  "man-overboard",
  "stealth-uuv",
  "diver-near-hull",
  "uuv-payload",
  "gps-spoofing",
  "comms-jamming",
  "anomalous-rf",
  "network-intrusion",
  "perimeter-breach",
  "unauthorized-vehicle",
  "tailgating",
  "unattended-object",
  "multi-domain-event",
  "support-center-lost",
  "special-event-mode",
] as const;

const BANNED = /\b(Command|Node|Dominate)\b/;
const usvEnglishName = SCENARIOS.find((item) => item.id === "usv-swarm")?.name ?? "";
const unsupervisedEnglish = usvEnglishName.split(" ")[0];

describe("localizeScenario", () => {
  it("covers all 23 catalog scenarios", () => {
    expect(SCENARIOS.map((item) => item.id).sort()).toEqual([...IDS].sort());
  });

  it("keeps English copy identical to the catalog", () => {
    for (const scenario of SCENARIOS) {
      const localized = localizeScenario("en", scenario);
      expect(localized.id).toBe(scenario.id);
      expect(localized.riskLevel).toBe(scenario.riskLevel);
      expect(localized.panelType).toBe(scenario.panelType);
      expect(localized.category).toBe(scenario.category);
      expect(localized.name).toBe(scenario.name);
      expect(localized.logText).toBe(scenario.logText);
      expect(localized.actionText).toBe(scenario.actionText);
      expect(localized.options?.map(({ label, detail, recommended }) => ({
        label,
        detail,
        recommended,
      }))).toEqual(scenario.options);
    }
  });

  it("translates name, log, action, options, and category in every locale", () => {
    for (const locale of locales) {
      if (locale === "en") continue;
      for (const scenario of SCENARIOS) {
        const localized = localizeScenario(locale, scenario);
        expect(localized.id).toBe(scenario.id);
        expect(localized.riskLevel).toBe(scenario.riskLevel);
        expect(localized.panelType).toBe(scenario.panelType);
        expect(localized.name).not.toBe("");
        expect(localized.logText).not.toBe("");
        expect(localized.actionText).not.toBe("");
        expect(localized.name).not.toBe(scenario.name);
        expect(localized.logText).not.toBe(scenario.logText);
        expect(localized.actionText).not.toBe(scenario.actionText);
        expect(localized.category.length).toBeGreaterThan(0);
        if (scenario.options) {
          expect(localized.options).toHaveLength(scenario.options.length);
          expect(localized.options?.map((item) => item.recommended)).toEqual(
            scenario.options.map((item) => item.recommended),
          );
          for (let i = 0; i < scenario.options.length; i += 1) {
            expect(localized.options?.[i]?.label).not.toBe(scenario.options[i]?.label);
            expect(localized.options?.[i]?.detail).not.toBe(scenario.options[i]?.detail);
          }
        } else {
          expect(localized.options).toBeUndefined();
        }
      }
    }
  });

  it("does not use banned English product words", () => {
    for (const locale of locales) {
      for (const scenario of SCENARIOS) {
        const localized = localizeScenario(locale, scenario);
        const blob = [
          localized.name,
          localized.logText,
          localized.actionText,
          localized.category,
          ...(localized.options ?? []).flatMap((item) => [item.label, item.detail]),
        ].join("\n");
        expect(blob).not.toMatch(BANNED);
        if (locale === "en" && scenario.id === "usv-swarm") {
          expect(localized.name).toBe(usvEnglishName);
        } else {
          expect(blob).not.toMatch(new RegExp(`\\b${unsupervisedEnglish}\\b`, "i"));
        }
      }
    }
  });
});

describe("localizeCrisisSteps", () => {
  it("matches English crisis protocols and fallback exactly", () => {
    for (const [id, steps] of Object.entries(CRISIS_PROTOCOLS)) {
      expect(localizeCrisisSteps("en", id, FALLBACK_CRISIS_STEPS)).toEqual(steps);
    }
    expect(
      localizeCrisisSteps("en", "recon-drone", FALLBACK_CRISIS_STEPS),
    ).toEqual(FALLBACK_CRISIS_STEPS);
  });

  it("translates every protocol and the fallback in all locales", () => {
    for (const locale of locales) {
      if (locale === "en") continue;
      for (const id of Object.keys(CRISIS_PROTOCOLS)) {
        const translated = localizeCrisisSteps(locale, id, FALLBACK_CRISIS_STEPS);
        expect(translated).toHaveLength(CRISIS_PROTOCOLS[id].length);
        expect(translated).not.toEqual(CRISIS_PROTOCOLS[id]);
        expect(translated.join("\n")).not.toMatch(BANNED);
        expect(translated.join("\n")).not.toMatch(
          new RegExp(`\\b${unsupervisedEnglish}\\b`, "i"),
        );
      }
      const fallback = localizeCrisisSteps(
        locale,
        "recon-drone",
        FALLBACK_CRISIS_STEPS,
      );
      expect(fallback).toHaveLength(FALLBACK_CRISIS_STEPS.length);
      expect(fallback).not.toEqual(FALLBACK_CRISIS_STEPS);
    }
  });
});

describe("localizeAutoActions", () => {
  it("matches English automated actions exactly", () => {
    for (const [id, steps] of Object.entries(AUTOMATED_ACTIONS)) {
      expect(localizeAutoActions("en", id, steps)).toEqual(steps);
    }
  });

  it("translates every automated action string", () => {
    for (const locale of locales) {
      if (locale === "en") continue;
      for (const [id, steps] of Object.entries(AUTOMATED_ACTIONS)) {
        const translated = localizeAutoActions(locale, id, steps);
        expect(translated).toHaveLength(steps.length);
        expect(translated).not.toEqual(steps);
        expect(translated.join("\n")).not.toMatch(BANNED);
        expect(translated.join("\n")).not.toMatch(
          new RegExp(`\\b${unsupervisedEnglish}\\b`, "i"),
        );
      }
    }
  });
});

describe("locale fallback", () => {
  it("falls back to English when a scenario is missing from a locale pack", () => {
    const unknown = {
      ...SCENARIOS[0],
      id: "not-in-catalog",
    };
    const localized = localizeScenario("es" as Locale, unknown);
    expect(localized.name).toBe(unknown.name);
    expect(localized.category).not.toBe(unknown.category);
  });
});
