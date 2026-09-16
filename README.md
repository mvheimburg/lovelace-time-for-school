# Lovelace Time for School Card

A dashboard card for the
[Time for School](https://github.com/mvheimburg/time-for-school)
integration.

![The card armed and alerting](images/screenshot.png)

- Weekly schedule: an on/off switch and a time for every weekday.
- Master enabled switch and skip-next.
- Blink count and blink interval sliders.
- Shows which entities get turned off and which lights blink.
- Big **Stop** button while the alert is running, "Test now" to try it.
- Failed service calls show a Home Assistant toast.

On a phone the card stacks into a single column:

<img src="images/alerting-phone.png" alt="The card alerting at phone width" width="320">

## Install

### HACS
Add this repository as a custom repository (category *Dashboard*) and install
**Time for School Card**. HACS registers the resource for you.

### Manual
1. Copy `dist/lovelace-time-for-school.js` to `config/www/`.
2. Add `/local/lovelace-time-for-school.js` as a *JavaScript module* resource
   under **Settings → Dashboards → Resources**.

## Card config

```yaml
type: custom:lovelace-time-for-school-card
entity: sensor.time_for_school
name: School run        # optional
```

## Build

```bash
npm ci
npm run lint
npm run typecheck
npm run build      # writes dist/lovelace-time-for-school.js
```

CI checks that `dist/` is committed up to date. Releases are automatic: bump
`version` in `package.json`, merge to `main`, and the release workflow tags
`v<version>` and attaches the built card to a GitHub release.
