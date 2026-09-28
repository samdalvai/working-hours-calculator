# Working Hours Calculator

A small browser app for calculating a Monday-to-Friday working week. It is
available at [samdalvai.github.io/working-hours-calculator](https://samdalvai.github.io/working-hours-calculator/).

## Features

- Record morning and afternoon entry and exit times for each workday.
- See each day's worked time and balance against an 8-hour day, plus the total
  against a 40-hour week.
- Validate the usual schedule: AM entry by 09:00, AM exit from 12:00, PM entry
  by 14:00, and PM exit from 16:30 (Monday to Thursday).
- Count a minimum 30-minute lunch break, even if a shorter break is entered.
- Calculate the suggested Friday exit time needed to reach 40 hours.
- Use a responsive layout that works on desktop and mobile screens.

## Run locally

```bash
npm install
npm run dev
```

Other useful commands:

- `npm run build` — create a production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — check the code style.

## GitHub Pages deployment

Pushing to `main` builds and deploys the app to GitHub Pages through the
repository workflow. In the repository settings, set **Pages** → **Build and
deployment** → **Source** to **GitHub Actions** once. The deployed URL is:

`https://samdalvai.github.io/working-hours-calculator/`
