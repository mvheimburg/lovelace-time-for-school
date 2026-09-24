import { html, svg, type SVGTemplateResult } from "lit";

export type IconName =
  | "school"
  | "bellRing"
  | "bellOff"
  | "alert"
  | "cog"
  | "close"
  | "power"
  | "skip"
  | "calendar"
  | "bulb"
  | "timer"
  | "screenOff"
  | "play"
  | "stop"
  | "check"
  | "clock";

const paths: Record<IconName, SVGTemplateResult> = {
  clock: svg`<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>`,
  school: svg`<path d="M22 10 12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>`,
  bellRing: svg`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8M22 8c0-2.3-.8-4.3-2-6"></path>`,
  bellOff: svg`<path d="M8.7 3A6 6 0 0 1 18 8c0 2 .2 3.6.6 5M17 17H3s3-2 3-9c0-.6.1-1.2.3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20"></path>`,
  alert: svg`<circle cx="12" cy="12" r="9"></circle><path d="M12 8v4.5M12 16h.01"></path>`,
  cog: svg`<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>`,
  close: svg`<path d="M18 6 6 18M6 6l12 12"></path>`,
  power: svg`<path d="M12 3v9"></path><path d="M18.4 6.6a9 9 0 1 1-12.8 0"></path>`,
  skip: svg`<path d="m5 5 9 7-9 7V5zM19 5v14"></path>`,
  calendar: svg`<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path>`,
  bulb: svg`<path d="M9 18h6M10 22h4"></path><path d="M15 14c.2-1 .7-1.7 1.5-2.5A5 5 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path>`,
  timer: svg`<path d="M10 2h4M12 14l3-3"></path><circle cx="12" cy="14" r="8"></circle>`,
  screenOff: svg`<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M4 3l16 16"></path>`,
  play: svg`<circle cx="12" cy="12" r="9"></circle><path d="m10 8.5 5 3.5-5 3.5v-7z"></path>`,
  stop: svg`<rect x="6" y="6" width="12" height="12" rx="2"></rect>`,
  check: svg`<path d="M20 6 9 17l-5-5"></path>`,
};

/** Stroke icons in currentColor; decorative, the text beside them carries meaning.
 *  Kept on one line so no whitespace leaks into a button's textContent. */
export const icon = (name: IconName, cls = "i") =>
  html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
