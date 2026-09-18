import { localize, type TranslationKey } from "./localize";
import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";

interface HomeAssistant {
  language?: string;
  locale?: { language?: string };
  states: Record<string, any>;
}

interface TimeForSchoolCardConfig {
  type: string;
  entity: string;
  name?: string;
  appearance?: "default" | "bubble";
}

@customElement("lovelace-time-for-school-editor")
export class TimeForSchoolCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TimeForSchoolCardConfig;

  private _t(key: TranslationKey): string { return localize(this.hass, key); }

  public setConfig(config: TimeForSchoolCardConfig): void {
    this._config = { appearance: "default", ...config };
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = { ...(ev.detail.value as Record<string, unknown>) };
    if (value.name === "") delete value.name;
    const newConfig = { ...this._config, ...value } as TimeForSchoolCardConfig;
    if (!("name" in value)) delete newConfig.name;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true
      })
    );
  }

  protected render() {
    if (!this.hass || !this._config) return html``;

    const SCHEMA = [
      {
        name: "appearance",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "default", label: this._t("Default") },
              { value: "bubble", label: this._t("Bubble") }
            ]
          }
        }
      },
      {
        name: "entity",
        required: true,
        selector: { entity: { integration: "time_for_school", domain: "sensor" } }
      },
      { name: "name", selector: { text: {} } }
    ];

    const LABELS: Record<string, string> = {
      appearance: this._t("Appearance"),
      entity: this._t("Time for School entity"),
      name: this._t("Name (optional)")
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;
}
