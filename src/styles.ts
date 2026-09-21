import { colorSchemeStyles } from "./color-schemes";
import { css } from "lit";

/* "Bubble night" family style, shared in spirit with the House State, Water
   Guard and Access Control cards. Tokens live on :host so the settings dialog,
   which sits outside ha-card, carries them as well. */
export const styles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
    --tfs-text: var(--primary-text-color, #1b1b1a);
    --tfs-muted: var(--secondary-text-color, #5b5a55);
    --tfs-armed: var(--success-color, #2e7d32);
    --tfs-go: var(--orange-color, #ea580c);
    --tfs-skip: var(--warning-color, #f59e0b);
    --tfs-neutral: var(--disabled-text-color, #8a8984);
    --tfs-accent: var(--primary-color, #03a9f4);
    --tfs-error: var(--error-color, #c62828);
    --tfs-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tfs-pill: var(--secondary-background-color, #f3f2ee);
    --tfs-radius: 20px;
    --tfs-tile: 16px;
  }
  :host([data-appearance="bubble"]) {
    --tfs-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --tfs-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --tfs-radius: var(--bubble-border-radius, 32px);
    --tfs-tile: var(--bubble-sub-button-border-radius, 22px);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--ha-card-border-radius, 16px);
    background: var(--tfs-surface);
    --sev: var(--tfs-neutral);
  }
  :host([data-appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  ha-card.is-armed {
    --sev: var(--tfs-armed);
  }
  ha-card.is-armed.skipping {
    --sev: var(--tfs-skip);
  }
  ha-card.is-alerting {
    --sev: var(--tfs-go);
  }

  .i {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .i.s {
    width: 18px;
    height: 18px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* Title line with the Configure cog. */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-left: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    color: var(--tfs-muted);
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .icon-button {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--tfs-muted);
    background: var(--tfs-pill);
    cursor: pointer;
  }
  .icon-button:hover {
    color: var(--tfs-text);
  }

  /* Hero: status, the next alert time, context. */
  .circ {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    border-radius: var(--bubble-icon-border-radius, 50%);
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--sev) 75%, var(--tfs-text));
    background: color-mix(in srgb, var(--sev) 20%, transparent);
  }
  .circ.big {
    flex-basis: 52px;
    width: 52px;
    height: 52px;
  }
  .hero {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 14px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .hero-text {
    min-width: 0;
    flex: 1;
  }
  .status {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--sev) 65%, var(--tfs-text));
  }
  .current {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .current.words {
    font-size: 24px;
  }
  .current.none {
    color: var(--tfs-muted);
  }
  .context {
    font-size: 13px;
    color: var(--tfs-muted);
    overflow-wrap: anywhere;
  }

  /* Alert takeover: amber, not red, because it is a reminder, not an emergency. */
  .alert {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--tfs-radius);
    color: #fff;
    background: color-mix(in srgb, var(--tfs-go) 62%, #000);
  }
  .alert-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .alert .circ {
    color: color-mix(in srgb, var(--tfs-go) 70%, #000);
    background: #fff;
    animation: tfs-pulse 1.4s ease-in-out infinite;
  }
  .alert .status {
    color: rgb(255 255 255 / 0.85);
  }
  .hero-title {
    display: block;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.1;
  }
  .hero-sub {
    display: block;
    font-size: 13px;
    color: rgb(255 255 255 / 0.85);
    overflow-wrap: anywhere;
  }
  .targets {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .target-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .target-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    margin-right: 2px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    background: rgb(0 0 0 / 0.22);
    overflow-wrap: anywhere;
  }
  button.stop {
    min-height: 56px;
    border: 0;
    border-radius: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font: inherit;
    font-size: 17px;
    font-weight: 800;
    color: color-mix(in srgb, var(--tfs-go) 62%, #000);
    background: #fff;
    cursor: pointer;
  }
  .alert button:focus-visible {
    outline-color: #fff;
  }

  /* Everyday controls. */
  .settings {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pill {
    flex: 1 1 120px;
    min-width: 0;
    min-height: 48px;
    border: 0;
    border-radius: 24px;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font: inherit;
    font-weight: 600;
    color: var(--tfs-text);
    background: var(--tfs-pill);
    cursor: pointer;
    text-align: left;
  }
  .pill-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.2;
  }
  .pill small {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.85;
  }
  .pill.on {
    --pill-accent: var(--tfs-armed);
    color: color-mix(in srgb, var(--pill-accent) 65%, var(--tfs-text));
    background: color-mix(in srgb, var(--pill-accent) 22%, var(--tfs-pill));
  }
  .pill.skip.on {
    --pill-accent: var(--tfs-skip);
  }
  .pill.pending,
  .day.pending {
    animation: tfs-breathe 1.2s ease-in-out infinite;
  }

  /* This week at a glance. */
  .week-strip {
    list-style: none;
    margin: 0;
    padding: 6px;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 4px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .wd {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 2px;
    border-radius: var(--tfs-tile);
    min-width: 0;
    text-align: center;
  }
  .wd-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--tfs-muted);
    text-transform: capitalize;
  }
  .wd-time {
    font-size: 14px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .wd.off .wd-time {
    color: var(--tfs-neutral);
    font-weight: 600;
  }
  .wd.today {
    box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--tfs-text) 18%, transparent);
  }
  .wd.next {
    color: color-mix(in srgb, var(--sev) 65%, var(--tfs-text));
    background: color-mix(in srgb, var(--sev) 22%, transparent);
  }
  .wd.next .wd-name {
    color: inherit;
  }
  .wd.skipped .wd-time {
    text-decoration: line-through;
    color: var(--tfs-muted);
  }
  .dim {
    opacity: 0.55;
  }

  button:disabled,
  input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--tfs-accent);
    outline-offset: 2px;
  }
  .error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    color: var(--tfs-error);
    overflow-wrap: anywhere;
  }

  /* Configure dialog. */
  dialog {
    box-sizing: border-box;
    width: min(520px, calc(100vw - 24px));
    max-height: calc(100dvh - 32px);
    padding: 20px;
    border: 0;
    border-radius: 24px;
    color: var(--tfs-text);
    background: var(--tfs-surface);
    box-shadow: 0 16px 60px #0006;
    overflow: auto;
  }
  :host([data-appearance="bubble"]) dialog {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
  }
  dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  dialog::backdrop {
    background: #0007;
  }
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-left: 4px;
  }
  .dialog-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    overflow-wrap: anywhere;
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--tfs-muted);
  }
  .label .value {
    margin-left: auto;
    font-size: 15px;
    letter-spacing: 0;
    text-transform: none;
    color: var(--tfs-text);
    font-variant-numeric: tabular-nums;
  }
  .day {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .day-toggle {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--tfs-muted);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    cursor: pointer;
  }
  .day-toggle[aria-checked="true"] {
    color: #fff;
    background: color-mix(in srgb, var(--tfs-armed) 62%, #000);
  }
  .day-name {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .day.off .day-name {
    color: var(--tfs-muted);
    font-weight: 600;
  }
  .time-input {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0 14px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-size: 17px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--tfs-text);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    color-scheme: inherit;
  }
  .slider-field {
    padding: 12px 10px 6px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .slider-field .label {
    padding: 0 6px;
  }
  .slider-field ha-slider {
    display: block;
    width: 100%;
  }
  .sliders {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  ha-selector {
    display: block;
    min-width: 0;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    padding: 6px 6px 6px 14px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .footer-note {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--tfs-muted);
    min-width: 0;
  }
  .text-button {
    min-height: 44px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-weight: 700;
    color: var(--tfs-text);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    cursor: pointer;
  }

  @keyframes tfs-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgb(255 255 255 / 0.5);
    }
    50% {
      box-shadow: 0 0 0 10px rgb(255 255 255 / 0);
    }
  }
  @keyframes tfs-breathe {
    50% {
      opacity: 0.55;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .alert .circ,
    .pill.pending,
    .day.pending {
      animation: none;
    }
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }
    .current {
      font-size: 26px;
    }
    .hero-title {
      font-size: 24px;
    }
    .week-strip {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .sliders {
      grid-template-columns: 1fr;
    }
    dialog {
      padding: 14px;
    }
  }
  ${colorSchemeStyles}
`;
