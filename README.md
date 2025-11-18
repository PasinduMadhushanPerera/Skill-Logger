
# Skill Logger (BETA)

Skill Logger is a lightweight single-page app to record, track and visualise your software engineering skills. It is built with React + Vite and stores data locally in the browser (LocalStorage). This repository contains a minimal, mobile-first UI for adding skills, categorising them, and viewing level distribution charts.

## Key features

- Add and manage skill entries with level, category and notes
- Local persistence using `localStorage` (no backend required)
- Interactive charts summarising skill levels
- Dark mode and simple sorting / filtering
- Small, dependency-light React + Vite codebase — easy to extend

## Current status

- Version: `0.1.0-beta`
- Status: BETA — early release for testing and feedback. Expect changes to data model and UI.

## Developer / Contact

- Developer: Your Name
- Email: you@example.com (replace with your contact)
- Source: https://github.com/yourname/skill-logger

If you want to appear as the official author, update the `author` field in `package.json` and replace the placeholders above.

## How to run (developer)

Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview a production build locally:

```powershell
npm run preview
```

## Notes and next steps

- This app stores all data locally. If you want cloud sync, integrate an API or a backend (e.g. Firebase).
- Update the `author`, `homepage`, and `repository` fields in `package.json` with real values before publishing.
- Consider adding automated tests and a simple migration strategy for data model changes.

---

If you'd like, I can also:

- Replace the placeholder developer name and contact with real details (if you provide them).
- Add an About/Settings modal that shows developer info and release notes inside the app UI.
