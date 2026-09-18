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
    const control = root.querySelector("ha-switch")! as HTMLElement & {
      checked: boolean;
    };
    control.checked = false;
    control.dispatchEvent(new Event("change"));
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
  expect(card.shadowRoot!.querySelector(".pill")!.textContent).toBe(label);
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
