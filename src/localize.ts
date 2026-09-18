export interface LanguageSource {
  language?: string;
  locale?: { language?: string };
}
export function language(hass?: LanguageSource): "en" | "nb" {
  const code = (hass?.language || hass?.locale?.language || "en")
    .toLowerCase()
    .replace(/_/g, "-")
    .split("-")[0];
  return ["nb", "no", "nn"].includes(code) ? "nb" : "en";
}
/** Preserve regional formatting independently of the translated dictionary. */
export function formattingLocale(hass?: LanguageSource): string {
  const code = (hass?.language || hass?.locale?.language || "en")
    .toLowerCase().replace(/_/g, "-").replace(/^(no|nn)(?=-|$)/, "nb");
  try {
    return Intl.getCanonicalLocales(code)[0] || "en";
  } catch {
    return "en";
  }
}
const en = {
  "No day enabled": "No day enabled",
  "Time for School entity": "Time for School entity",
  "Name (optional)": "Name (optional)",
  Appearance: "Appearance",
  Default: "Default",
  Bubble: "Bubble",
  "Lights are blinking and screens are off · since":
    "Lights are blinking and screens are off · since",
  "No upcoming alert": "No upcoming alert",
  "Time for school!": "Time for school!",
  "Time for school": "Time for school",
  "Weekly schedule": "Weekly schedule",
  "Close settings": "Close settings",
  "Blink interval": "Blink interval",
  "Alert is off": "Alert is off",
  "Blink count": "Blink count",
  Configure: "Configure",
  "Skip next": "Skip next",
  "(not set)": "(not set)",
  "Turns off": "Turns off",
  "Test now": "Test now",
  Tomorrow: "Tomorrow",
  settings: "settings",
  Enabled: "Enabled",
  Blinks: "Blinks",
  Today: "Today",
  "Next:": "Next:",
  Stop: "Stop",
  Started: "Started",
  h: "h",
  in: "in",
  ago: "ago",
  "Entity not found": "Entity not found",
  "Define an entity": "Define an entity",
  Time: "Time",
  "Action failed": "Action failed",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
  Off: "Off",
  Armed: "Armed",
  "Time to go!": "Time to go!",
  Unavailable: "Unavailable",
  Unknown: "Unknown",
} as const;
export type TranslationKey = keyof typeof en;
const nb: Record<TranslationKey, string> = {
  "No day enabled": "Ingen dager aktivert",
  "Time for School entity": "Tid for skolen-enhet",
  "Name (optional)": "Navn (valgfritt)",
  Appearance: "Utseende",
  Default: "Standard",
  Bubble: "Boble",
  "Lights are blinking and screens are off · since":
    "Lysene blinker og skjermene er av · siden",
  "No upcoming alert": "Ingen kommende varsling",
  "Time for school!": "Tid for skolen!",
  "Time for school": "Tid for skolen",
  "Weekly schedule": "Ukeplan",
  "Close settings": "Lukk innstillinger",
  "Blink interval": "Blinkintervall",
  "Alert is off": "Varsling er slått av",
  "Blink count": "Antall blink",
  Configure: "Konfigurer",
  "Skip next": "Hopp over neste",
  "(not set)": "(ikke angitt)",
  "Turns off": "Slår av",
  "Test now": "Test nå",
  Tomorrow: "I morgen",
  settings: "innstillinger",
  Enabled: "Aktivert",
  Blinks: "Blinker",
  Today: "I dag",
  "Next:": "Neste:",
  Stop: "Stopp",
  Started: "Startet",
  h: "t",
  in: "om",
  ago: "siden",
  "Entity not found": "Fant ikke enheten",
  "Define an entity": "Du må angi en enhet",
  Time: "Tid",
  "Action failed": "Handlingen mislyktes",
  Monday: "Mandag",
  Tuesday: "Tirsdag",
  Wednesday: "Onsdag",
  Thursday: "Torsdag",
  Friday: "Fredag",
  Saturday: "Lørdag",
  Sunday: "Søndag",
  Off: "Av",
  Armed: "Aktivert",
  "Time to go!": "På tide å gå!",
  Unavailable: "Utilgjengelig",
  Unknown: "Ukjent",
};
export function localize(
  hass: LanguageSource | undefined,
  key: TranslationKey,
): string {
  return (language(hass) === "nb" ? nb : en)[key];
}
