import { afterEach, expect, it, vi } from "vitest";
import { TimeForSchoolCard } from "../src/lovelace-time-for-school";

afterEach(() => document.body.replaceChildren());

const day = (enabled: boolean, time: string, custom = false) => ({ enabled, time, custom });

function mount(
  attributes: Record<string, unknown> = {},
  options: { language?: string; fail?: boolean } = {}
) {
  const calls: unknown[][] = [];
  let release: (() => void) | undefined;
  const card = new TimeForSchoolCard();
  card.setConfig({ type: "custom:lovelace-time-for-school-card", entity: "sensor.test" });
  card.hass = {
    language: options.language ?? "en",
    states: {
      "sensor.test": {
        entity_id: "sensor.test",
        state: "armed",
        attributes: {
          enabled: true,
          time_of_day: "07:45",
          schedule: {
            mon: day(true, "07:45"),
            tue: day(true, "08:10", true),
            sat: day(false, "07:45"),
          },
          ...attributes,
        },
      },
    },
    callService: vi.fn(async (...args: unknown[]) => {
      calls.push(args);
      if (options.fail) throw new Error("Refused");
      await new Promise<void>((resolve) => (release = resolve));
    }),
  };
  document.body.append(card);
  // The time inputs live in the settings dialog.
  void card.updateComplete.then(() =>
    card.shadowRoot!.querySelector<HTMLButtonElement>('[aria-haspopup="dialog"]')!.click()
  );
  const toasts: string[] = [];
  card.addEventListener("hass-notification", (e) =>
    toasts.push((e as CustomEvent).detail.message)
  );
  return { card, calls, toasts, answer: () => release?.() };
}
const input = (card: TimeForSchoolCard, key: string) =>
  card.shadowRoot!.querySelector<HTMLInputElement>(`[data-time="${key}"]`)!;
function type(el: HTMLInputElement, value: string, event: "input" | "change" = "change") {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  if (event === "change") el.dispatchEvent(new Event("change", { bubbles: true }));
}

it("sends a typed time once editing ends, not when the hour is complete", async () => {
  const { card, calls, answer } = mount();
  await card.updateComplete;
  const monday = input(card, "day-mon");
  monday.focus();
  // A browser reports a change as soon as the value is complete: after the hour.
  type(monday, "08:45");
  type(monday, "08:30");
  await card.updateComplete;
  expect(calls).toEqual([]);
  expect(monday.value).toBe("08:30");
  monday.blur();
  await card.updateComplete;
  expect(calls).toEqual([
    ["time_for_school", "set_day", { entity_id: "sensor.test", day: "mon", time: "08:30" }],
  ]);
  // The input stays usable and keeps the entered time while the house answers.
  expect(monday.disabled).toBe(false);
  expect(monday.value).toBe("08:30");
  expect(monday.getAttribute("aria-busy")).toBe("true");
  answer();
  await vi.waitFor(() => expect(monday.getAttribute("aria-busy")).toBe("false"));
});

it("sends at once when a picker changes the time without focus, and on Enter", async () => {
  const { card, calls, answer } = mount();
  await card.updateComplete;
  type(input(card, "day-mon"), "06:50");
  await card.updateComplete;
  expect(calls).toHaveLength(1);
  answer();
  await card.updateComplete;
  const tuesday = input(card, "day-tue");
  tuesday.focus();
  type(tuesday, "09:05", "input");
  tuesday.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  await card.updateComplete;
  expect(calls[1]).toEqual([
    "time_for_school",
    "set_day",
    { entity_id: "sensor.test", day: "tue", time: "09:05" },
  ]);
});

it("sends nothing for an unchanged or cleared time and shows the saved one again", async () => {
  const { card, calls } = mount();
  await card.updateComplete;
  const monday = input(card, "day-mon");
  monday.focus();
  type(monday, "07:45");
  monday.blur();
  monday.focus();
  type(monday, "");
  monday.blur();
  await card.updateComplete;
  expect(calls).toEqual([]);
  expect(monday.value).toBe("07:45");
});

it("shows the saved time again after a refusal", async () => {
  const { card, calls, toasts } = mount({}, { fail: true });
  await card.updateComplete;
  const monday = input(card, "day-mon");
  type(monday, "09:00");
  await vi.waitFor(() => expect(toasts).toHaveLength(1));
  await card.updateComplete;
  expect(calls).toHaveLength(1);
  expect(toasts[0]).toContain("Refused");
  expect(monday.value).toBe("07:45");
});

it("edits the default time, marks days with their own time and resets them, in Bokmål", async () => {
  const { card, calls, answer } = mount({}, { language: "nb" });
  await card.updateComplete;
  const root = card.shadowRoot!;
  expect(root.querySelector(".default-time")!.textContent).toContain("Standardtid");
  const fallback = input(card, "default");
  expect(fallback.getAttribute("aria-label")).toBe("Standardtid");
  type(fallback, "08:00");
  await card.updateComplete;
  expect(calls[0]).toEqual([
    "time_for_school",
    "set_config",
    { entity_id: "sensor.test", time_of_day: "08:00" },
  ]);
  answer();
  await card.updateComplete;

  expect(root.querySelector('[data-day="tue"] .day-name')!.textContent).toContain("Egen tid");
  expect(root.querySelector('[data-day="mon"] .day-name')!.textContent).not.toContain("Egen tid");
  expect(root.querySelector('[data-use-default="mon"]')).toBeNull();
  const reset = root.querySelector<HTMLButtonElement>('[data-use-default="tue"]')!;
  expect(reset.textContent!.trim()).toBe("Tilbakestill");
  expect(reset.getAttribute("aria-label")).toBe("Bruk standardtid for Tirsdag");
  reset.click();
  await card.updateComplete;
  expect(calls[1]).toEqual([
    "time_for_school",
    "set_day",
    { entity_id: "sensor.test", day: "tue", use_default: true },
  ]);
});

it("works with an integration from before the default time", async () => {
  const { card } = mount({
    time_of_day: undefined,
    schedule: { mon: { enabled: true, time: "07:45" }, tue: { enabled: true, time: "08:10" } },
  });
  await card.updateComplete;
  const root = card.shadowRoot!;
  expect(root.querySelector(".default-time")).toBeNull();
  expect(root.querySelector("[data-use-default]")).toBeNull();
  expect(input(card, "day-tue").value).toBe("08:10");
});
