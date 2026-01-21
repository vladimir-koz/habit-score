# habit-score

Small MVP built with **React + Vite (JavaScript)**.

## Features (MVP)
- Add habits: `name`, `category`, `points` (can be negative)
- List habits
- Toggle `done today`
- Daily score (derived): sum of points of habits marked as done today
- Filter by category (All or one category)
- Persistence with `localStorage` (load on start, save on change)
- Simple CSS (no frameworks) + basic responsive layout

## Tech
- React (functional components)
- Vite
- No external UI libraries
- Local state: `useState`
- Derived values: `useMemo`
- Side effects: `useEffect`
- localStorage with `try/catch`

## Getting Started
Install and run:

```bash
npm install
npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).

## Project Structure

src/
  components/
    CategoryFilter.jsx
    HabitForm.jsx
    HabitList.jsx
    ScoreBar.jsx
  utils/
    storage.js
  App.jsx
  App.css

## Notes
In dev, React StrictMode may run effects twice; the app prevents overwriting storage before initial load completes.

