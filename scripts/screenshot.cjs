const { chromium } = require("playwright");
const { readFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "..");

const light = `color-scheme: light; --primary-text-color: #1b1b1a; --secondary-text-color: #5b5a55; --card-background-color: #fff; --secondary-background-color: #f3f2ee; --primary-color: #1d4ed8; background: #eeede9;`;
const dark = `color-scheme: dark; --primary-text-color: #eceef1; --secondary-text-color: #9aa0aa; --card-background-color: #1a1c20; --secondary-background-color: #22252a; --primary-color: #8ab4f8; --success-color: #6fd39a; --warning-color: #f5c451; --orange-color: #ff9a6b; --disabled-text-color: #6b7078; --bubble-main-background-color: #1a1c20; --bubble-secondary-background-color: #22252a; --bubble-border-radius: 32px; background: #121316;`;

/** Simulated Time for School states; no live Home Assistant. */
function states(variant) {
  const at = (date, h, m) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  const now = new Date();
  // The next school day after today (Monday to Friday).
  const next = new Date(now);
  do next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6);
  const schedule = {
    mon: { enabled: true, time: "07:45" },
    tue: { enabled: true, time: "07:45" },
    wed: { enabled: true, time: "08:10" },
    thu: { enabled: true, time: "07:45" },
    fri: { enabled: true, time: "07:45" },
    sat: { enabled: false, time: "07:45" },
    sun: { enabled: false, time: "07:45" },
  };
  const key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][next.getDay()];
  const [h, m] = schedule[key].time.split(":").map(Number);
  const attributes = {
    friendly_name: "Skolevarsel",
    enabled: true,
    skip_next: false,
    schedule,
    blink_count: 5,
    blink_interval: 1,
    off_entities: ["media_player.living_room_tv", "media_player.kitchen_speaker"],
    blink_lights: ["light.hall", "light.kitchen"],
    next_fire: at(next, h, m).toISOString(),
    skipped_fire: null,
    run_started: variant === "alerting" ? new Date(Date.now() - 3 * 60000).toISOString() : null,
  };
  const named = (entity_id, friendly_name) => ({ entity_id, state: "on", attributes: { friendly_name } });
  return {
    "sensor.time_for_school": {
      entity_id: "sensor.time_for_school",
      state: variant === "alerting" ? "alerting" : "armed",
      attributes,
    },
    "media_player.living_room_tv": named("media_player.living_room_tv", "Stue-TV"),
    "media_player.kitchen_speaker": named("media_player.kitchen_speaker", "Kjøkkenhøyttaler"),
    "light.hall": named("light.hall", "Gang"),
    "light.kitchen": named("light.kitchen", "Kjøkken"),
  };
}

/* Stand-ins for Home Assistant's own ha-slider and ha-selector, which only
   exist inside the HA frontend. They render roughly what HA shows. */
const stubs = `
  customElements.define("ha-slider", class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<input type="range" style="width:100%;accent-color:var(--primary-color)">';
      const input = this.firstChild;
      for (const a of ["min", "max", "step"]) input.setAttribute(a, this.getAttribute(a));
      input.value = this.value;
    }
  });
  customElements.define("ha-selector", class extends HTMLElement {
    set value(ids) { this._ids = ids; this.render(); }
    set hass(hass) { this._hass = hass; this.render(); }
    render() {
      if (!this._ids || !this._hass) return;
      this.style.cssText = "display:flex;flex-wrap:wrap;gap:6px";
      this.innerHTML = this._ids.map((id) =>
        '<span style="padding:8px 14px;border-radius:18px;font-weight:600;background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)">' +
        (this._hass.states[id]?.attributes.friendly_name ?? id) + "</span>").join("");
    }
  });
`;

async function shot(browser, errors, { file, theme, cards, width = 1000, height = 700, cardWidth = 420, openSettings = false }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, locale: "nb-NO" });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setContent(`<style>
    body { margin: 0; padding: ${width < 500 ? 16 : 28}px; font: 15px system-ui, sans-serif; ${theme} }
    main { display: flex; gap: 28px; align-items: flex-start; }
    main > * { flex: 0 0 ${cardWidth}px; }
  </style><main></main>`);
  await page.addScriptTag({ content: stubs });
  await page.addScriptTag({ type: "module", content: readFileSync(resolve(root, "dist/lovelace-time-for-school.js"), "utf8") });
  await page.evaluate(async ({ cards, openSettings }) => {
    await customElements.whenDefined("lovelace-time-for-school-card");
    for (const { states, appearance } of cards) {
      const card = document.createElement("lovelace-time-for-school-card");
      card.setConfig({ type: "custom:lovelace-time-for-school-card", entity: "sensor.time_for_school", appearance });
      card.hass = { states, language: "nb", locale: { language: "nb" }, callService: () => new Promise(() => {}) };
      document.querySelector("main").append(card);
      await card.updateComplete;
      if (openSettings) {
        card.shadowRoot.querySelector('[aria-label="Konfigurer"]').click();
        card.shadowRoot.activeElement?.blur();
      }
    }
  }, { cards, openSettings });
  await page.screenshot({ path: resolve(root, "images", file), fullPage: !openSettings });
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--lang=nb-NO"],
    // Native time inputs follow the OS locale, as they do for a Norwegian household's browser.
    env: { ...process.env, LANG: "nb_NO.UTF-8", LANGUAGE: "nb_NO:nb", LC_ALL: "nb_NO.UTF-8" },
  });
  try {
    const errors = [];
    mkdirSync(resolve(root, "images"), { recursive: true });
    await shot(browser, errors, {
      file: "bubble-night.png",
      theme: dark,
      cards: [
        { states: states("armed"), appearance: "bubble" },
        { states: states("alerting"), appearance: "bubble" },
      ],
    });
    await shot(browser, errors, {
      file: "light.png",
      theme: light,
      cards: [
        { states: states("armed"), appearance: "default" },
        { states: states("alerting"), appearance: "default" },
      ],
    });
    await shot(browser, errors, {
      file: "configure.png",
      theme: dark,
      width: 600,
      height: 1000,
      openSettings: true,
      cards: [{ states: states("armed"), appearance: "bubble" }],
    });
    await shot(browser, errors, {
      file: "phone.png",
      theme: dark,
      width: 360,
      height: 640,
      cardWidth: 328,
      cards: [{ states: states("alerting"), appearance: "bubble" }],
    });
    if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
    console.log("Wrote images/bubble-night.png, images/light.png, images/configure.png and images/phone.png with simulated Home Assistant data.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
