import { applyColorScheme } from "./color-schemes";
import type { ColorScheme } from "./color-schemes";
import { localize, formattingLocale, type TranslationKey } from "./localize";
import { LitElement, html, nothing } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { live } from "lit/directives/live.js";
import { icon, type IconName } from "./icons";
import { styles } from "./styles";
import "./lovelace-time-for-school-editor";

interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

interface HomeAssistant {
  language?: string;
  states: Record<string, HassEntity>;
  locale?: { language?: string };
  callService(domain: string, service: string, data?: Record<string, any>): Promise<unknown>;
}

interface TimeForSchoolCardConfig {
  type: string;
  entity: string;
  name?: string;
  appearance?: "default" | "bubble";
  color_scheme?: ColorScheme;
}

interface DaySchedule {
  enabled: boolean;
  /** The time the day's alert fires: its own, or the default time. */
  time: string;
  /** Whether the time is the day's own rather than the default (integration 0.4.0). */
  custom?: boolean;
}

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const WEEKDAY_LABELS: Record<string, TranslationKey> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday"
};

const STATE_LABELS: Record<string, TranslationKey> = {
  disarmed: "Off",
  armed: "Armed",
  alerting: "Time to go!",
  unavailable: "Unavailable",
  unknown: "Unknown"
};

const STATE_ICONS: Record<string, IconName> = {
  disarmed: "bellOff",
  armed: "school",
  alerting: "bellRing"
};

/** JavaScript Date.getDay() index to the integration's weekday keys. */
const JS_DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

@customElement("lovelace-time-for-school-card")
export class TimeForSchoolCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TimeForSchoolCardConfig;
  @state() private _draft: Record<string, number> = {};
  @state() private _busy: string | null = null;
  /** Time inputs being edited: sent when editing ends, not on every keystroke. */
  @state() private _timeDrafts: Record<string, string> = {};
  private _committing: Record<string, string> = {};
  private _tick?: number;

  private _t(key: TranslationKey): string { return localize(this.hass, key); }

  public setConfig(config: TimeForSchoolCardConfig): void {
    if (!config.entity) {
      throw new Error(this._t("Define an entity") + ": lovelace-time-for-school-card");
    }
    applyColorScheme(this, config.color_scheme, this.hass);
    this._config = config;
    this.setAttribute("data-appearance", config.appearance === "bubble" ? "bubble" : "default");
  }

  public getCardSize(): number {
    return 3;
  }

  public static getConfigElement(): Element {
    return document.createElement("lovelace-time-for-school-editor");
  }

  public static getStubConfig(hass?: HomeAssistant): TimeForSchoolCardConfig {
    const found = hass
      ? Object.values(hass.states).find(
          (s) =>
            s.entity_id.startsWith("sensor.") &&
            "schedule" in s.attributes &&
            "blink_count" in s.attributes
        )
      : undefined;
    return { type: "custom:lovelace-time-for-school-card", entity: found?.entity_id ?? "" };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => this.requestUpdate(), 30_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) window.clearInterval(this._tick);
  }

  // ---------------------------------------------------------------- helpers

  private _entity(): HassEntity | undefined {
    return this.hass?.states?.[this._config?.entity];
  }

  private _lang(): string | undefined {
    return formattingLocale(this.hass);
  }

  private _fmtTime(value: string | null | undefined): string {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleTimeString(this._lang(), { hour: "2-digit", minute: "2-digit" });
  }

  private _fmtDay(value: string | null | undefined): string {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const dayDiff = Math.round((startOf(d) - startOf(now)) / 86_400_000);
    if (dayDiff === 0) return this._t("Today");
    if (dayDiff === 1) return this._t("Tomorrow");
    return d.toLocaleDateString(this._lang(), { weekday: "short" });
  }

  private _fmtRelative(value: string | null | undefined): string {
    if (!value) return "";
    const diffMin = Math.round((new Date(value).getTime() - Date.now()) / 60_000);
    if (Number.isNaN(diffMin)) return "";
    const abs = Math.abs(diffMin);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    const span = h ? (m ? `${h} ${this._t("h")} ${m} min` : `${h} ${this._t("h")}`) : `${m} min`;
    return diffMin >= 0 ? `${this._t("in")} ${span}` : `${span} ${this._t("ago")}`;
  }

  /** Locale-aware clock for an "HH:MM" schedule time; keeps the raw value if malformed. */
  private _fmtClock(value: string): string {
    const [h, m] = value.split(":").map(Number);
    if (!Number.isInteger(h) || !Number.isInteger(m)) return value;
    const d = new Date(2024, 0, 1, h, m);
    return d.toLocaleTimeString(this._lang(), { hour: "2-digit", minute: "2-digit" });
  }

  private _shortDay(index: number): string {
    // 1 January 2024 was a Monday.
    return new Date(2024, 0, 1 + index).toLocaleDateString(this._lang(), { weekday: "short" });
  }

  private _dayKey(value: string | null | undefined): string | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : JS_DAY_KEYS[d.getDay()];
  }

  private _normalizeTime(value: unknown): string {
    if (!value) return "07:45";
    const s = String(value);
    return s.length >= 5 && s.indexOf(":") === 2 ? s.slice(0, 5) : "07:45";
  }

  private _toast(message: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true })
    );
  }

  private async _call(service: string, data: Record<string, unknown> = {}, label = service) {
    this._busy = label;
    try {
      await this.hass.callService("time_for_school", service, {
        entity_id: this._config.entity,
        ...data
      });
    } catch (err: any) {
      const msg = err?.message || err?.error || String(err);
      this._toast(`${this._t("Time for school")}: ${this._t("Action failed")} (${msg})`);
    } finally {
      this._busy = null;
    }
  }

  private _set(partial: Record<string, unknown>, label = "set_config") {
    return this._call("set_config", partial, label);
  }

  private _name(entityId: string): string {
    return this.hass?.states?.[entityId]?.attributes?.friendly_name || entityId;
  }

  private _setDay(day: string, partial: Record<string, unknown>) {
    return this._call("set_day", { day, ...partial }, `day-${day}`);
  }

  /**
   * Send a time once editing ends: when the input loses focus (or Enter), or at
   * once when a picker changed it without focus. A browser reports a change as
   * soon as the typed value is complete, e.g. after the hour, which is too early.
   * Until the house answers, the input keeps what was entered; after a refusal it
   * shows the authoritative time again.
   */
  private async _commitTime(
    key: string,
    current: string,
    commit: (value: string) => Promise<unknown>
  ): Promise<void> {
    const next = this._timeDrafts[key]?.slice(0, 5);
    if (next === undefined || this._committing[key] === next) return;
    const drop = () => {
      const drafts = { ...this._timeDrafts };
      delete drafts[key];
      this._timeDrafts = drafts;
      delete this._committing[key];
    };
    if (!/^\d\d:\d\d$/.test(next) || next === current) {
      drop();
      return;
    }
    this._committing[key] = next;
    try {
      await commit(next);
    } finally {
      drop();
    }
  }

  private _timeInput(
    key: string,
    current: string,
    label: string,
    disabled: boolean,
    commit: (value: string) => Promise<unknown>
  ) {
    const draft = (e: Event) => {
      this._timeDrafts = { ...this._timeDrafts, [key]: (e.target as HTMLInputElement).value };
    };
    return html`<input
      class="time-input"
      type="time"
      data-time=${key}
      aria-label=${label}
      aria-busy=${key in this._committing ? "true" : "false"}
      .value=${live(this._timeDrafts[key] ?? current)}
      ?disabled=${disabled}
      @input=${draft}
      @change=${(e: Event) => {
        draft(e);
        if (this.shadowRoot?.activeElement !== e.target) void this._commitTime(key, current, commit);
      }}
      @blur=${() => void this._commitTime(key, current, commit)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />`;
  }

  private _openSettings(): void {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.showModal();
  }

  private _closeSettings(): void {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.close();
  }

  private _sliderInput(key: string, ev: Event): void {
    this._draft = { ...this._draft, [key]: Number((ev.target as HTMLInputElement).value) };
  }

  private async _sliderChange(key: string, ev: Event): Promise<void> {
    await this._set({ [key]: Number((ev.target as HTMLInputElement).value) });
    const draft = { ...this._draft };
    delete draft[key];
    this._draft = draft;
  }

  // ---------------------------------------------------------------- render

  protected render() {
    const stateObj = this._entity();
    if (!stateObj) {
      return html`
        <ha-card>
          <div class="error">
            ${icon("alert")}
            <span>${this._t("Entity not found")}: ${this._config?.entity || this._t("(not set)")}</span>
          </div>
        </ha-card>
      `;
    }

    const a = stateObj.attributes;
    const st = stateObj.state;
    const alerting = st === "alerting";
    // Actions stay off while the entity reports no data.
    const available = st !== "unavailable" && st !== "unknown";
    const enabled = Boolean(a.enabled);
    const skipNext = Boolean(a.skip_next);
    const schedule: Record<string, DaySchedule> = a.schedule ?? {};
    const blinkCount = this._draft.blink_count ?? Number(a.blink_count ?? 5);
    const blinkInterval = this._draft.blink_interval ?? Number(a.blink_interval ?? 1);
    const nextFire: string | null = a.next_fire ?? null;
    const skippedFire: string | null = a.skipped_fire ?? null;
    const runStarted: string | null = a.run_started ?? null;
    const offEntities: string[] = Array.isArray(a.off_entities) ? a.off_entities : [];
    const blinkLights: string[] = Array.isArray(a.blink_lights) ? a.blink_lights : [];
    const title = this._config.name || a.friendly_name || this._t("Time for school");
    const statusLabel = STATE_LABELS[st] ? this._t(STATE_LABELS[st]) : st;
    // Integration 0.4.0: one default time that days follow unless they have their own.
    const hasDefault = typeof a.time_of_day === "string";
    const defaultTime = this._normalizeTime(a.time_of_day);

    return html`
      <ha-card class=${classMap({ [`is-${st}`]: true, skipping: skipNext })}>
        <div class="header">
          <div class="title">${title}</div>
          <button class="icon-button" type="button" title=${this._t("Configure")} aria-label=${this._t("Configure")}
            aria-haspopup="dialog" @click=${this._openSettings}>${icon("cog")}</button>
        </div>

        ${alerting
          ? this._renderAlert(statusLabel, runStarted, offEntities, blinkLights)
          : this._renderHero(st, statusLabel, nextFire)}

        <div class="settings">
          <div class="toggles">
            ${this._renderToggle("enabled", "power", this._t("Enabled"), enabled, !available)}
            ${this._renderToggle(
              "skip_next",
              "skip",
              this._t("Skip next"),
              skipNext,
              !available || !enabled,
              skipNext && skippedFire ? `${this._fmtDay(skippedFire)} ${this._fmtTime(skippedFire)}` : ""
            )}
          </div>
          ${this._renderWeekStrip(schedule, enabled, alerting ? null : nextFire, skipNext ? skippedFire : null)}
        </div>
      </ha-card>

      <dialog aria-labelledby="settings-title" @click=${(e: MouseEvent) => {
        if (e.target !== e.currentTarget) return;
        const rect = (e.currentTarget as HTMLDialogElement).getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          this._closeSettings();
        }
      }}>
        <div class="dialog-header">
          <h2 id="settings-title">${title} ${this._t("settings")}</h2>
          <button class="icon-button" type="button" title=${this._t("Close settings")} aria-label=${this._t("Close settings")}
            autofocus @click=${this._closeSettings}>${icon("close")}</button>
        </div>
        <div class="settings">
          ${hasDefault
            ? html`<div class="day default-time">
                <span class="day-name">${icon("clock", "i s")}${this._t("Default time")}</span>
                ${this._timeInput("default", defaultTime, this._t("Default time"), !available, (time) =>
                  this._set({ time_of_day: time }, "time_of_day"))}
              </div>`
            : nothing}
          <section class="section week">
            <span class="label">${icon("calendar", "i s")}${this._t("Weekly schedule")}</span>
            ${WEEKDAYS.map((day) => {
              const d = schedule[day] ?? { enabled: false, time: defaultTime };
              const dayLabel = this._t(WEEKDAY_LABELS[day]);
              const pending = this._busy === `day-${day}`;
              const own = hasDefault && Boolean(d.custom);
              return html`
                <div class=${classMap({ day: true, off: !d.enabled, dim: !enabled, pending, own })} data-day=${day}>
                  <button
                    class="day-toggle"
                    type="button"
                    role="switch"
                    aria-checked=${d.enabled ? "true" : "false"}
                    aria-label=${`${dayLabel} ${this._t("Enabled")}`}
                    ?disabled=${pending || !available}
                    @click=${() => this._setDay(day, { enabled: !d.enabled })}
                  >${d.enabled ? icon("check", "i s") : nothing}</button>
                  <span class="day-name">${dayLabel}${own ? html`<small>${this._t("Own time")}</small>` : nothing}</span>
                  ${own
                    ? html`<button
                        class="text-button reset"
                        type="button"
                        data-use-default=${day}
                        aria-label=${`${this._t("Use default time for")} ${dayLabel}`}
                        title=${`${this._t("Use default time for")} ${dayLabel}`}
                        ?disabled=${pending || !available}
                        @click=${() => this._setDay(day, { use_default: true })}
                      >${this._t("Reset")}</button>`
                    : nothing}
                  ${this._timeInput(
                    `day-${day}`,
                    this._normalizeTime(d.time),
                    `${dayLabel} ${this._t("Time")}`,
                    !d.enabled || !available,
                    (time) => this._setDay(day, { time })
                  )}
                </div>
              `;
            })}
          </section>

          <div class="sliders">
            ${this._renderSlider("bulb", this._t("Blink count"), "blink_count", blinkCount, 1, 20, 1, `${blinkCount}×`, !available)}
            ${this._renderSlider("timer", this._t("Blink interval"), "blink_interval", blinkInterval, 0.2, 5, 0.1, `${blinkInterval.toLocaleString(this._lang(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`, !available)}
          </div>

          <section class="section">
            <span class="label">${icon("screenOff", "i s")}${this._t("Turns off")}</span>
            ${this._renderTargets("off_entities", offEntities,
              ["media_player", "switch", "light", "fan", "remote", "input_boolean"], !available)}
          </section>
          <section class="section">
            <span class="label">${icon("bulb", "i s")}${this._t("Blinks")}</span>
            ${this._renderTargets("blink_lights", blinkLights, ["light"], !available)}
          </section>
        </div>

        <div class="footer">
          <span class="footer-note">
            ${nextFire && !alerting
              ? html`${icon("bellRing", "i s")}
                  ${this._t("Next:")} ${this._fmtDay(nextFire)} ${this._fmtTime(nextFire)}`
              : enabled
                ? alerting
                  ? nothing
                  : html`${icon("bellOff", "i s")} ${this._t("No day enabled")}`
                : html`${icon("bellOff", "i s")} ${this._t("Alert is off")}`}
          </span>
          <button
            class="text-button"
            type="button"
            ?disabled=${this._busy === "trigger_now" || !available}
            @click=${() => {
              this._closeSettings();
              return this._call("trigger_now");
            }}
          >${icon("play", "i s")}<span>${this._t("Test now")}</span></button>
        </div>
      </dialog>
    `;
  }

  private _renderHero(st: string, statusLabel: string, nextFire: string | null) {
    let headline: string;
    let context = "";
    let kind: "time" | "words" | "none" = "words";
    if (st === "armed" && nextFire) {
      headline = this._fmtTime(nextFire);
      context = `${this._fmtDay(nextFire)} · ${this._fmtRelative(nextFire)}`;
      kind = "time";
    } else if (st === "armed") {
      headline = this._t("No upcoming alert");
    } else if (st === "disarmed") {
      headline = this._t("Alert is off");
    } else {
      headline = "--:--";
      kind = "none";
    }
    return html`
      <div class="hero">
        <div class="circ big">${icon(STATE_ICONS[st] ?? "alert")}</div>
        <div class="hero-text">
          <div class="status">${statusLabel}</div>
          <div class=${classMap({ current: true, words: kind === "words", none: kind === "none" })}>${headline}</div>
          ${context ? html`<div class="context">${context}</div>` : nothing}
        </div>
      </div>
    `;
  }

  private _renderAlert(statusLabel: string, runStarted: string | null, offEntities: string[], blinkLights: string[]) {
    const line = (iconName: IconName, label: string, ids: string[]) =>
      ids.length
        ? html`<div class="target-line">
            <span class="target-label">${icon(iconName, "i s")}${label}</span>
            ${ids.map((id) => html`<span class="chip">${this._name(id)}</span>`)}
          </div>`
        : nothing;
    return html`
      <div class="alert">
        <div class="alert-head">
          <div class="circ big">${icon("bellRing")}</div>
          <div class="hero-text">
            <div class="status">${statusLabel}</div>
            <span class="hero-title">${this._t("Time for school!")}</span>
            <span class="hero-sub">${this._t("Lights are blinking and screens are off · since")} ${this._fmtTime(runStarted)}</span>
          </div>
        </div>
        ${blinkLights.length || offEntities.length
          ? html`<div class="targets">
              ${line("bulb", this._t("Blinks"), blinkLights)}
              ${line("screenOff", this._t("Turns off"), offEntities)}
            </div>`
          : nothing}
        <button class="stop" type="button" ?disabled=${this._busy === "stop"} @click=${() => this._call("stop")}
          >${icon("stop")}<span>${this._t("Stop")}</span></button>
      </div>
    `;
  }

  private _renderToggle(
    key: "enabled" | "skip_next",
    iconName: IconName,
    label: string,
    checked: boolean,
    disabled: boolean,
    detail = ""
  ) {
    const busyLabel = `toggle-${key}`;
    const pending = this._busy === busyLabel;
    return html`
      <button
        class=${classMap({ pill: true, skip: key === "skip_next", on: checked, pending })}
        type="button"
        role="switch"
        aria-checked=${checked ? "true" : "false"}
        aria-busy=${pending ? "true" : "false"}
        data-toggle=${key}
        ?disabled=${disabled || pending}
        @click=${() => this._set({ [key]: !checked }, busyLabel)}
      >${icon(iconName)}<span class="pill-text"><span>${label}</span>${detail ? html`<small>${detail}</small>` : nothing}</span></button>
    `;
  }

  private _renderWeekStrip(
    schedule: Record<string, DaySchedule>,
    enabled: boolean,
    nextFire: string | null,
    skippedFire: string | null
  ) {
    const nextKey = this._dayKey(nextFire);
    const skipKey = this._dayKey(skippedFire);
    const todayKey = JS_DAY_KEYS[new Date().getDay()];
    return html`
      <ul class=${classMap({ "week-strip": true, dim: !enabled })} aria-label=${this._t("This week")}>
        ${WEEKDAYS.map((day, index) => {
          const d = schedule[day];
          const on = Boolean(d?.enabled);
          return html`
            <li class=${classMap({ wd: true, off: !on, today: day === todayKey, next: on && day === nextKey, skipped: on && day === skipKey })}
              data-day=${day}>
              <span class="wd-name" aria-hidden="true">${this._shortDay(index)}</span>
              <span class="sr-only">${this._t(WEEKDAY_LABELS[day])}</span>
              <span class="wd-time">${on
                ? this._fmtClock(this._normalizeTime(d.time))
                : html`<span aria-hidden="true">–</span><span class="sr-only">${this._t("Off")}</span>`}</span>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private _renderSlider(
    iconName: IconName,
    label: string,
    key: string,
    value: number,
    min: number,
    max: number,
    step: number,
    display: string,
    disabled: boolean
  ) {
    return html`
      <div class="field slider-field">
        <span class="label">
          ${icon(iconName, "i s")}${label}
          <span class="value">${display}</span>
        </span>
        <ha-slider
          min=${min}
          max=${max}
          step=${step}
          .value=${value}
          .disabled=${disabled}
          @input=${(e: Event) => this._sliderInput(key, e)}
          @change=${(e: Event) => this._sliderChange(key, e)}
        ></ha-slider>
      </div>
    `;
  }

  private _renderTargets(key: string, value: string[], domains: string[], disabled: boolean) {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${{ entity: { multiple: true, domain: domains } }}
        .value=${value}
        .label=${key === "off_entities" ? this._t("Turns off") : this._t("Blinks")}
        .disabled=${this._busy !== null || disabled}
        @value-changed=${(ev: CustomEvent) => {
          ev.stopPropagation();
          const selected = ev.detail.value ?? [];
          if (Array.isArray(selected) && selected.every((item) => typeof item === "string")) {
            void this._set({ [key]: selected });
          }
        }}
      ></ha-selector>
    `;
  }

  static styles = styles;
}

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview?: boolean }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "lovelace-time-for-school-card",
  name: "Time for School Card",
  description: "Weekly 'time to leave for school' alert: schedule per weekday, blink settings, stop.",
  preview: true
});
