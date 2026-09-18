import { localize, language, type TranslationKey } from "./localize";
import { LitElement, css, html, nothing } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
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
}

interface DaySchedule {
  enabled: boolean;
  time: string;
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

const STATE_ICONS: Record<string, string> = {
  disarmed: "mdi:school-outline",
  armed: "mdi:school",
  alerting: "mdi:bell-ring"
};

@customElement("lovelace-time-for-school-card")
export class TimeForSchoolCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TimeForSchoolCardConfig;
  @state() private _draft: Record<string, number> = {};
  @state() private _busy: string | null = null;
  private _tick?: number;

  private _t(key: TranslationKey): string { return localize(this.hass, key); }

  public setConfig(config: TimeForSchoolCardConfig): void {
    if (!config.entity) {
      throw new Error(this._t("Define an entity") + ": lovelace-time-for-school-card");
    }
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
    return language(this.hass);
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

  private _set(partial: Record<string, unknown>) {
    return this._call("set_config", partial, "set_config");
  }

  private _setDay(day: string, partial: Record<string, unknown>) {
    return this._call("set_day", { day, ...partial }, `day-${day}`);
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
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${this._t("Entity not found")}: ${this._config?.entity || this._t("(not set)")}
          </div>
        </ha-card>
      `;
    }

    const a = stateObj.attributes;
    const st = stateObj.state;
    const alerting = st === "alerting";
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
    const icon = STATE_ICONS[st] ?? "mdi:school";

    return html`
      <ha-card class=${classMap({ [`is-${st}`]: true })}>
        <div class="header">
          <div class="header-main">
            <div class="icon-wrap"><ha-icon icon=${icon}></ha-icon></div>
            <div class="header-text">
              <div class="title">${title}</div>
              <div class="subtitle">${this._renderSubtitle(st, nextFire, runStarted)}</div>
            </div>
          </div>
          <div class="header-actions">
            <div class="pill"><span class="dot"></span>${STATE_LABELS[st] ? this._t(STATE_LABELS[st]) : st}</div>
            <button class="icon-button" type="button" title=${this._t("Configure")} aria-label=${this._t("Configure")}
              @click=${this._openSettings}>
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </button>
          </div>
        </div>

        ${alerting
          ? html`
              <div class="hero">
                <div class="hero-text">
                  <span class="hero-title">${this._t("Time for school!")}</span>
                  <span class="hero-sub">
                    ${this._t("Lights are blinking and screens are off · since")} ${this._fmtTime(runStarted)}
                  </span>
                </div>
                <button
                  class="stop"
                  type="button"
                  ?disabled=${this._busy === "stop"}
                  @click=${() => this._call("stop")}
                >
                  <ha-icon icon="mdi:stop-circle-outline"></ha-icon>
                  ${this._t("Stop")}
                </button>
              </div>
            `
          : nothing}

        <div class="settings">
          <div class="toggles">
            <label class="toggle">
              <span><ha-icon icon="mdi:power"></ha-icon>${this._t("Enabled")}</span>
              <ha-switch
                .checked=${enabled}
                @change=${(e: Event) =>
                  this._set({ enabled: (e.target as HTMLInputElement).checked })}
              ></ha-switch>
            </label>
            <label class="toggle">
              <span>
                <ha-icon icon="mdi:debug-step-over"></ha-icon>${this._t("Skip next")}
                ${skipNext && skippedFire
                  ? html`<small>${this._fmtDay(skippedFire)} ${this._fmtTime(skippedFire)}</small>`
                  : nothing}
              </span>
              <ha-switch
                .checked=${skipNext}
                ?disabled=${!enabled}
                @change=${(e: Event) =>
                  this._set({ skip_next: (e.target as HTMLInputElement).checked })}
              ></ha-switch>
            </label>
          </div>
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
            autofocus @click=${this._closeSettings}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="settings">
          <div class="week">
            <span class="label"><ha-icon icon="mdi:calendar-week"></ha-icon>${this._t("Weekly schedule")}</span>
            ${WEEKDAYS.map((day) => {
              const d = schedule[day] ?? { enabled: false, time: "07:45" };
              return html`
                <div class=${classMap({ day: true, off: !d.enabled, dim: !enabled })}>
                  <ha-switch
                    aria-label=${`${this._t(WEEKDAY_LABELS[day])} ${this._t("Enabled")}`}
                    .checked=${Boolean(d.enabled)}
                    @change=${(e: Event) =>
                      this._setDay(day, { enabled: (e.target as HTMLInputElement).checked })}
                  ></ha-switch>
                  <span class="day-name">${this._t(WEEKDAY_LABELS[day])}</span>
                  <input
                    class="time-input"
                    type="time"
                    aria-label=${`${this._t(WEEKDAY_LABELS[day])} ${this._t("Time")}`}
                    .value=${this._normalizeTime(d.time)}
                    ?disabled=${!d.enabled}
                    @change=${(e: Event) =>
                      this._setDay(day, { time: (e.target as HTMLInputElement).value })}
                  />
                </div>
              `;
            })}
          </div>

          ${this._renderSlider("mdi:lightbulb-on-outline", this._t("Blink count"), "blink_count", blinkCount, 1, 20, 1, `${blinkCount}×`)}
          ${this._renderSlider("mdi:timer-outline", this._t("Blink interval"), "blink_interval", blinkInterval, 0.2, 5, 0.1, `${blinkInterval.toFixed(1)} s`)}

          <div class="field chips-field">
            <span class="label"><ha-icon icon="mdi:television-off"></ha-icon>${this._t("Turns off")}</span>
            ${this._renderTargets("off_entities", offEntities,
              ["media_player", "switch", "light", "fan", "remote", "input_boolean"])}
          </div>
          <div class="field chips-field">
            <span class="label"><ha-icon icon="mdi:lightbulb-group-outline"></ha-icon>${this._t("Blinks")}</span>
            ${this._renderTargets("blink_lights", blinkLights, ["light"])}
          </div>
        </div>

        <div class="footer">
          <span class="footer-note">
            ${nextFire && !alerting
              ? html`<ha-icon icon="mdi:bell-outline"></ha-icon>
                  ${this._t("Next:")} ${this._fmtDay(nextFire)} ${this._fmtTime(nextFire)}`
              : enabled
                ? alerting
                  ? nothing
                  : html`<ha-icon icon="mdi:bell-off-outline"></ha-icon> ${this._t("No day enabled")}`
                : html`<ha-icon icon="mdi:bell-off-outline"></ha-icon> ${this._t("Alert is off")}`}
          </span>
          <button
            class="text-button"
            type="button"
            ?disabled=${this._busy === "trigger_now"}
            @click=${() => {
              this._closeSettings();
              return this._call("trigger_now");
            }}
          >
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            ${this._t("Test now")}
          </button>
        </div>
      </dialog>
    `;
  }

  private _renderSubtitle(st: string, nextFire: string | null, runStarted: string | null) {
    switch (st) {
      case "armed":
        return nextFire
          ? `${this._fmtDay(nextFire)} ${this._fmtTime(nextFire)} · ${this._fmtRelative(nextFire)}`
          : this._t("No upcoming alert");
      case "alerting":
        return `${this._t("Started")} ${this._fmtTime(runStarted)}`;
      case "disarmed":
        return this._t("Alert is off");
      default:
        return "";
    }
  }

  private _renderSlider(
    icon: string,
    label: string,
    key: string,
    value: number,
    min: number,
    max: number,
    step: number,
    display: string
  ) {
    return html`
      <div class="field slider-field">
        <span class="label">
          <ha-icon icon=${icon}></ha-icon>${label}
          <span class="value">${display}</span>
        </span>
        <ha-slider
          min=${min}
          max=${max}
          step=${step}
          .value=${value}
          @input=${(e: Event) => this._sliderInput(key, e)}
          @change=${(e: Event) => this._sliderChange(key, e)}
        ></ha-slider>
      </div>
    `;
  }

  private _renderTargets(key: string, value: string[], domains: string[]) {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${{ entity: { multiple: true, domain: domains } }}
        .value=${value}
        .label=${key === "off_entities" ? this._t("Turns off") : this._t("Blinks")}
        .disabled=${this._busy !== null}
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

  static styles = css`
    :host {
      --tfs-accent: var(--primary-color, #03a9f4);
      --tfs-accent-text: var(--text-primary-color, #fff);
      --tfs-danger: var(--error-color, #db4437);
      --tfs-warn: var(--warning-color, #ff9800);
      --tfs-muted: var(--secondary-text-color, #727272);
      --tfs-surface: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      --tfs-radius: var(--ha-card-border-radius, 12px);
      --tfs-ring-color: var(--tfs-accent);
    }
    ha-card {
      padding: 16px;
      box-sizing: border-box;
      overflow: hidden;
    }
    ha-card.is-alerting { --tfs-ring-color: var(--tfs-warn); }
    ha-card.is-disarmed { --tfs-ring-color: var(--tfs-muted); }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .header-main {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .header-actions { display: flex; align-items: center; gap: 4px; flex: none; }
    .icon-button {
      display: inline-grid;
      place-items: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--tfs-muted);
      cursor: pointer;
      flex: none;
    }
    .icon-button:hover { background: var(--tfs-surface); }
    button:focus-visible { outline: 2px solid var(--tfs-accent); outline-offset: 2px; }
    dialog {
      box-sizing: border-box;
      width: min(520px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      padding: 20px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: var(--tfs-radius);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      box-shadow: 0 12px 40px #0004;
      overflow: auto;
    }
    dialog::backdrop { background: #0007; }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .dialog-header h2 { margin: 0; font-size: 1.1rem; font-weight: 600; overflow-wrap: anywhere; }
    .icon-wrap {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: none;
      background: color-mix(in srgb, var(--tfs-ring-color) 16%, transparent);
      color: var(--tfs-ring-color);
      transition: background 300ms, color 300ms;
    }
    .icon-wrap ha-icon { --mdc-icon-size: 24px; }
    .is-alerting .icon-wrap { animation: tfs-pulse 1.2s ease-in-out infinite; }
    .header-text { min-width: 0; }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.25;
      overflow-wrap: anywhere;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .subtitle {
      font-size: 0.82rem;
      color: var(--tfs-muted);
      margin-top: 2px;
    }
    .pill {
      flex: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      padding: 4px 10px;
      border-radius: 999px;
      color: var(--tfs-ring-color);
      background: color-mix(in srgb, var(--tfs-ring-color) 14%, transparent);
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }
    .is-alerting .dot { animation: tfs-blink 0.8s steps(2, start) infinite; }

    .hero {
      margin-top: 16px;
      padding: 16px;
      border-radius: var(--tfs-radius);
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: var(--tfs-ring-color);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--tfs-ring-color) 22%, transparent),
        color-mix(in srgb, var(--tfs-ring-color) 6%, transparent)
      );
      border: 1px solid color-mix(in srgb, var(--tfs-ring-color) 30%, transparent);
    }
    .hero-text { display: flex; flex-direction: column; gap: 2px; }
    .hero-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.01em; }
    .hero-sub { font-size: 0.85rem; color: var(--primary-text-color); opacity: 0.85; }
    .stop {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: calc(var(--tfs-radius) - 2px);
      background: var(--tfs-danger);
      color: #fff;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 6px 18px color-mix(in srgb, var(--tfs-danger) 35%, transparent);
      transition: transform 120ms ease, filter 120ms ease;
    }
    .stop ha-icon { --mdc-icon-size: 26px; }
    .stop:hover { filter: brightness(1.05); }
    .stop:active { transform: scale(0.985); }
    button:disabled { opacity: 0.6; cursor: progress; }

    .settings {
      margin-top: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 20px;
    }
    .toggles {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      border-radius: calc(var(--tfs-radius) - 4px);
      background: var(--tfs-surface);
      overflow: hidden;
    }
    .toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .toggle + .toggle {
      border-top: 1px solid color-mix(in srgb, var(--tfs-muted) 18%, transparent);
    }
    .toggle > span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      white-space: nowrap;
    }
    .toggle ha-icon { --mdc-icon-size: 20px; color: var(--tfs-muted); }
    .toggle small {
      font-size: 0.72rem;
      color: var(--tfs-muted);
      padding: 1px 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--tfs-muted) 14%, transparent);
    }

    .week {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .week .label { margin-bottom: 4px; }
    .day {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--tfs-surface);
      transition: opacity 150ms;
    }
    .day.off .day-name { color: var(--tfs-muted); }
    .day.off .time-input { opacity: 0.45; }
    .day.dim { opacity: 0.6; }
    .day-name { font-size: 0.92rem; font-weight: 500; }
    .day .time-input {
      width: auto;
      padding: 4px 8px;
      font-size: 1rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--tfs-muted);
    }
    .label ha-icon { --mdc-icon-size: 18px; }
    .label .value {
      margin-left: auto;
      color: var(--primary-text-color);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .value.muted { color: var(--tfs-muted); font-weight: 400; font-size: 0.85rem; }
    .time-input {
      box-sizing: border-box;
      font-family: inherit;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(127,127,127,0.3));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .slider-field ha-slider { width: 100%; margin: 0 -4px; }
    .chips-field { grid-column: 1 / -1; }
    ha-selector { display: block; min-width: 0; }

    .footer {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127,127,127,0.2));
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: var(--tfs-muted);
    }
    .footer-note { display: inline-flex; align-items: center; gap: 6px; }
    .footer ha-icon { --mdc-icon-size: 18px; }
    .text-button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: var(--tfs-accent);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .text-button:hover { background: color-mix(in srgb, var(--tfs-accent) 10%, transparent); }
    .error { display: flex; align-items: center; gap: 8px; color: var(--tfs-danger); }

    @keyframes tfs-pulse {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--tfs-ring-color) 45%, transparent); }
      50% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--tfs-ring-color) 0%, transparent); }
    }
    @keyframes tfs-blink { to { opacity: 0.25; } }

    :host([data-appearance="bubble"]) {
      --tfs-accent: var(--bubble-accent-color, var(--primary-color, #03a9f4));
      --tfs-surface: var(--bubble-secondary-background-color, var(--card-background-color, #fff));
      --tfs-radius: var(--bubble-border-radius, 28px);
      --mdc-theme-primary: var(--tfs-accent);
      --switch-checked-color: var(--tfs-accent);
    }
    :host([data-appearance="bubble"]) ha-card,
    :host([data-appearance="bubble"]) dialog {
      background: var(--bubble-main-background-color, var(--secondary-background-color, #f2f3f5));
      border: var(--bubble-border, none);
      border-radius: var(--tfs-radius);
      box-shadow: var(--bubble-box-shadow, none);
    }
    :host([data-appearance="bubble"]) .header { gap: 8px; }
    :host([data-appearance="bubble"]) .title { font-size: 1rem; }
    :host([data-appearance="bubble"]) .icon-wrap {
      border-radius: var(--bubble-icon-border-radius, 50%);
      background: var(--bubble-icon-background-color, var(--tfs-surface));
    }
    :host([data-appearance="bubble"]) .icon-button,
    :host([data-appearance="bubble"]) .text-button {
      border-radius: var(--bubble-sub-button-border-radius, 20px);
      background: var(--bubble-sub-button-background-color, var(--tfs-surface));
    }
    :host([data-appearance="bubble"]) .icon-button:hover,
    :host([data-appearance="bubble"]) .text-button:hover { filter: brightness(0.95); }
    :host([data-appearance="bubble"]) .toggles {
      border-radius: var(--bubble-sub-button-border-radius, 20px);
    }
    :host([data-appearance="bubble"]) .toggle { padding: 12px; }
    :host([data-appearance="bubble"]) .pill { letter-spacing: 0; }
    :host([data-appearance="bubble"]) .time-input,
    :host([data-appearance="bubble"]) select {
      background: var(--tfs-surface);
      border-radius: var(--bubble-sub-button-border-radius, 20px);
    }
    :host([data-appearance="bubble"]) .day,
    :host([data-appearance="bubble"]) .preset {
      border-radius: var(--bubble-sub-button-border-radius, 20px);
    }
    :host([data-appearance="bubble"]) .hero {
      border-radius: var(--bubble-sub-button-border-radius, 20px);
      background: color-mix(in srgb, var(--tfs-ring-color) 12%, var(--tfs-surface));
    }
    :host([data-appearance="bubble"]) .stop {
      border-radius: var(--bubble-sub-button-border-radius, 24px);
    }

    @media (max-width: 480px) {
      .settings { grid-template-columns: 1fr; }
      dialog { padding: 16px; }
      .day { gap: 8px; }
      .header { gap: 6px; }
      .header-main { gap: 8px; }
      .toggle > span { white-space: normal; flex-wrap: wrap; }
    }
  `;
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
