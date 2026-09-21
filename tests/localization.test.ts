import { afterEach, expect, it } from "vitest";
import type { TimeForSchoolCardEditor } from "../src/lovelace-time-for-school-editor";
import { TimeForSchoolCard } from "../src/lovelace-time-for-school";
afterEach(() => document.body.replaceChildren());
it.each(["nb", "NB_no", "no", "nn-NO"])(
  "localizes rendered settings and keeps service payloads for %s",
  async (language) => {
    const calls: unknown[] = [];
    const card = new TimeForSchoolCard();
    card.setConfig({
      type: "custom:lovelace-time-for-school",
      entity: "sensor.test",
    });
    card.hass = {
      language,
      states: {
        "sensor.test": {
          entity_id: "sensor.test",
          state: "armed",
          attributes: {
            enabled: true,
            wake_mode: "both",
            person_entities: [],
            day_times: {},
            schedule: { mon: { enabled: true, time: "07:00" } },
          },
        },
      },
      callService: async (...args) => {
        calls.push(args);
      },
    };
    document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot!;
    expect(root.textContent).toContain("Ukeplan");
    expect(root.querySelector('[aria-label="Konfigurer"]')).not.toBeNull();
    const control = root.querySelector<HTMLButtonElement>('[data-toggle="enabled"]')!;
    expect(control.getAttribute("aria-checked")).toBe("true");
    control.click();
    await card.updateComplete;
    expect(calls).toEqual([
      [
        "time_for_school",
        "set_config",
        { entity_id: "sensor.test", enabled: false },
      ],
    ]);
    card.hass = { ...card.hass, language: "fr", locale: { language: "nb" } };
    await card.updateComplete;
    expect(root.querySelector('[aria-label="Configure"]')).not.toBeNull();
    card.hass = { ...card.hass, language: undefined };
    await card.updateComplete;
    expect(root.querySelector('[aria-label="Konfigurer"]')).not.toBeNull();
  },
);
it("localizes editor labels without changing configuration values", async () => {
  const editor =
    TimeForSchoolCard.getConfigElement() as TimeForSchoolCardEditor;
  editor.setConfig({
    type: "custom:lovelace-time-for-school",
    entity: "sensor.test",
    name: "My name",
  });
  editor.hass = { language: "nb", states: {} };
  document.body.append(editor);
  await editor.updateComplete;
  const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & {
    computeLabel: (schema: { name: string }) => string;
    schema: Array<{ selector: { select: { options: unknown[] } } }>;
    data: { name: string };
  };
  expect(form.computeLabel({ name: "appearance" })).toBe("Utseende");
  expect(form.schema[0].selector.select.options[0]).toEqual({
    value: "default",
    label: "Standard",
  });
  expect(form.data.name).toBe("My name");
  editor.hass = { language: "en", states: {} };
  await editor.updateComplete;
  expect(form.computeLabel({ name: "appearance" })).toBe("Appearance");
});
it("translates schedules, active states and errors while preserving weekday payloads", async () => {
  const card = new TimeForSchoolCard();
  const calls: unknown[] = [];
  card.setConfig({
    type: "custom:lovelace-time-for-school-card",
    entity: "sensor.test",
    name: "My school",
  });
  card.hass = {
    language: "nb",
    states: {
      "sensor.test": {
        entity_id: "sensor.test",
        state: "alerting",
        attributes: {
          enabled: true,
          schedule: { mon: { enabled: true, time: "07:45" } },
        },
      },
    },
    callService: async (...args) => {
      calls.push(args);
      throw new Error("Backend detail");
    },
  };
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot!;
  expect(root.querySelectorAll(".settings")).toHaveLength(2);
  expect(root.querySelector(".hero-title")!.textContent).toBe(
    "Tid for skolen!",
  );
  expect(root.querySelector(".title")!.textContent).toBe("My school");
  expect(root.querySelector(".day-name")!.textContent).toBe("Mandag");
  const monday = root.querySelector<HTMLInputElement>(
    '[aria-label="Mandag Tid"]',
  )!;
  monday.value = "08:15";
  let notification = "";
  card.addEventListener("hass-notification", (event) => {
    notification = (event as CustomEvent).detail.message;
  });
  monday.dispatchEvent(new Event("change"));
  await card.updateComplete;
  await card.updateComplete;
  expect(calls).toEqual([
    [
      "time_for_school",
      "set_day",
      { entity_id: "sensor.test", day: "mon", time: "08:15" },
    ],
  ]);
  expect(notification).toBe(
    "Tid for skolen: Handlingen mislyktes (Backend detail)",
  );
  card.hass = {
    ...card.hass,
    states: {
      "sensor.test": {
        ...card.hass.states["sensor.test"],
        state: "disarmed",
        attributes: {},
      },
    },
  };
  await card.updateComplete;
  expect(root.textContent).toContain("Varsling er slått av");
});

it.each([
  ["disarmed", "Av"],
  ["armed", "Aktivert"],
  ["alerting", "På tide å gå!"],
  ["unavailable", "Utilgjengelig"],
  ["unknown", "Ukjent"],
])("localizes the %s status", async (state, label) => {
  const card = new TimeForSchoolCard();
  card.setConfig({
    type: "custom:lovelace-time-for-school",
    entity: "sensor.test",
  });
  card.hass = {
    language: "nb-NO",
    states: {
      "sensor.test": { entity_id: "sensor.test", state, attributes: {} },
    },
    callService: async () => {},
  };
  document.body.append(card);
  await card.updateComplete;
  expect(card.shadowRoot!.querySelector(".status")!.textContent).toBe(label);
});
it("localizes missing entities while preserving their IDs", async () => {
  const card = new TimeForSchoolCard();
  card.setConfig({
    type: "custom:lovelace-time-for-school",
    entity: "sensor.missing",
  });
  card.hass = { language: "nb", states: {}, callService: async () => {} };
  document.body.append(card);
  await card.updateComplete;
  expect(card.shadowRoot!.textContent).toContain(
    "Fant ikke enheten: sensor.missing",
  );
});

it("formats fractional blink intervals in the display language", async () => {
  const card = new TimeForSchoolCard();
  card.setConfig({ type: "custom:lovelace-time-for-school", entity: "sensor.test" });
  card.hass = {
    language: "nb",
    states: { "sensor.test": { entity_id: "sensor.test", state: "armed", attributes: { blink_interval: 0.5 } } },
    callService: async () => {},
  };
  document.body.append(card);
  await card.updateComplete;
  expect(card.shadowRoot!.textContent).toContain("0,5 s");
  card.hass = { ...card.hass, language: "en" };
  await card.updateComplete;
  expect(card.shadowRoot!.textContent).toContain("0.5 s");
});

it("preserves regional English time formatting", async () => {
  const card = new TimeForSchoolCard();
  card.setConfig({ type: "custom:lovelace-time-for-school", entity: "sensor.test" });
  card.hass = {
    language: "en-GB",
    states: { "sensor.test": { entity_id: "sensor.test", state: "armed", attributes: { enabled: true, next_fire: new Date(2026, 8, 21, 17, 30).toISOString() } } },
    callService: async () => {},
  };
  document.body.append(card);
  await card.updateComplete;
  expect(card.shadowRoot!.textContent).toContain("17:30");
  expect(card.shadowRoot!.textContent).not.toContain("05:30 PM");
});

function schoolCard(state: string, attributes: Record<string, unknown>, language = "nb") {
  const calls: unknown[] = [];
  const card = new TimeForSchoolCard();
  card.setConfig({ type: "custom:lovelace-time-for-school-card", entity: "sensor.test" });
  card.hass = {
    language,
    states: {
      "sensor.test": { entity_id: "sensor.test", state, attributes },
      "light.hall": { entity_id: "light.hall", state: "on", attributes: { friendly_name: "Gang" } },
    },
    callService: async (...args) => {
      calls.push(args);
    },
  };
  document.body.append(card);
  return { card, calls };
}

it("opens Configure from the cog and closes it again", async () => {
  const { card } = schoolCard("armed", { enabled: true });
  await card.updateComplete;
  const root = card.shadowRoot!;
  const dialog = root.querySelector("dialog")!;
  expect(dialog.open).toBe(false);
  root.querySelector<HTMLButtonElement>('[aria-label="Konfigurer"]')!.click();
  expect(dialog.open).toBe(true);
  expect(dialog.querySelector(".day-name")!.textContent).toBe("Mandag");
  dialog.querySelector<HTMLButtonElement>('[aria-label="Lukk innstillinger"]')!.click();
  expect(dialog.open).toBe(false);
});

it("keeps everyday controls on the card and detailed settings behind Configure", async () => {
  const { card } = schoolCard("armed", {
    enabled: true,
    blink_count: 5,
    schedule: { mon: { enabled: true, time: "07:45" }, tue: { enabled: false, time: "08:00" } },
  });
  await card.updateComplete;
  const cardEl = card.shadowRoot!.querySelector("ha-card")!;
  expect(cardEl.querySelector('[data-toggle="enabled"]')).not.toBeNull();
  expect(cardEl.querySelector('[data-toggle="skip_next"]')).not.toBeNull();
  expect(cardEl.querySelector("ha-slider, ha-selector, input[type=time]")).toBeNull();
  const week = cardEl.querySelector(".week-strip")!;
  expect(week.getAttribute("aria-label")).toBe("Denne uka");
  expect(week.querySelector('[data-day="mon"] .wd-time')!.textContent).toBe("07:45");
  expect(week.querySelector('[data-day="tue"]')!.classList.contains("off")).toBe(true);
  expect(week.querySelector('[data-day="tue"]')!.textContent).toContain("Av");
});

it("shows the next alert time as the hero headline", async () => {
  const next = new Date(2030, 0, 7, 7, 45).toISOString();
  const { card } = schoolCard("armed", { enabled: true, next_fire: next }, "en-GB");
  await card.updateComplete;
  const root = card.shadowRoot!;
  expect(root.querySelector(".status")!.textContent).toBe("Armed");
  expect(root.querySelector(".current")!.textContent).toBe("07:45");
});

it("toggles a weekday from Configure with the same set_day payload", async () => {
  const { card, calls } = schoolCard("armed", { enabled: true, schedule: { mon: { enabled: true, time: "07:45" } } });
  await card.updateComplete;
  const toggle = card.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Mandag Aktivert"]')!;
  expect(toggle.getAttribute("role")).toBe("switch");
  expect(toggle.getAttribute("aria-checked")).toBe("true");
  toggle.click();
  await card.updateComplete;
  expect(calls).toEqual([["time_for_school", "set_day", { entity_id: "sensor.test", day: "mon", enabled: false }]]);
});

it("lists the affected devices and stops the alert from the takeover", async () => {
  const { card, calls } = schoolCard("alerting", { enabled: true, blink_lights: ["light.hall"], off_entities: ["media_player.tv"] });
  await card.updateComplete;
  const alert = card.shadowRoot!.querySelector(".alert")!;
  const chips = [...alert.querySelectorAll(".chip")].map((chip) => chip.textContent);
  expect(chips).toEqual(["Gang", "media_player.tv"]);
  alert.querySelector<HTMLButtonElement>(".stop")!.click();
  await card.updateComplete;
  expect(calls).toEqual([["time_for_school", "stop", { entity_id: "sensor.test" }]]);
});

it("disables actions while the entity is unavailable but keeps Configure reachable", async () => {
  const { card } = schoolCard("unavailable", { enabled: true });
  await card.updateComplete;
  const root = card.shadowRoot!;
  expect(root.querySelector<HTMLButtonElement>('[data-toggle="enabled"]')!.disabled).toBe(true);
  expect(root.querySelector<HTMLButtonElement>('[data-toggle="skip_next"]')!.disabled).toBe(true);
  expect(root.querySelector<HTMLButtonElement>('[aria-label="Konfigurer"]')!.disabled).toBe(false);
});

it("marks a toggle pending and blocks a duplicate request until Home Assistant answers", async () => {
  let resolve!: () => void;
  const calls: unknown[] = [];
  const card = new TimeForSchoolCard();
  card.setConfig({ type: "custom:lovelace-time-for-school-card", entity: "sensor.test" });
  card.hass = {
    language: "en",
    states: { "sensor.test": { entity_id: "sensor.test", state: "armed", attributes: { enabled: true } } },
    callService: (...args) => {
      calls.push(args);
      return new Promise<void>((r) => (resolve = r));
    },
  };
  document.body.append(card);
  await card.updateComplete;
  const toggle = card.shadowRoot!.querySelector<HTMLButtonElement>('[data-toggle="skip_next"]')!;
  toggle.click();
  await card.updateComplete;
  expect(toggle.disabled).toBe(true);
  expect(toggle.getAttribute("aria-busy")).toBe("true");
  toggle.click();
  expect(calls).toHaveLength(1);
  resolve();
  await new Promise((r) => setTimeout(r));
  await card.updateComplete;
  expect(toggle.disabled).toBe(false);
});
