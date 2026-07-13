---
name: Console-website import quirks
description: Environment/build issues found running the imported "Console Website" repo (client=React/Vite, server=Express, Supabase DB) on Replit.
---

- The repo has case-mismatched imports (`import Login from "./pages/Login"` vs actual file `login.jsx`) that only fail on case-sensitive filesystems like Replit's Linux container, not on Windows/Mac dev machines the original authors likely used.
  **Why:** silently breaks the whole app bundle (500 from Vite) with no obvious cause unless you check the workflow log.
  **How to apply:** if imports resolve fine on `git status`/editor but Vite throws "Failed to resolve import", check for case mismatches first.

- `client/src/lib/supabase.js` used a `typeof import.meta !== "undefined"` branch that assumed non-Vite code paths use `process.env`, but referencing `process` at all throws `ReferenceError: process is not defined` in the browser bundle even inside an unreached ternary branch is fine — the real bug was that `import.meta.env.VITE_*` was falsy (no `.env` file) so it always fell into the `process.env` branch and crashed. Fixed by reading from `import.meta.env` directly with a hardcoded default, no `process` reference in client code at all.

- The Express backend (`server/index.js`) and the Vite frontend both defaulted to port 5000, and Replit's webview workflow requires the frontend on port 5000 — so the leaderboard's `fetch('http://localhost:5000/api/leaderboard')` hits the Vite server itself and gets HTML, not JSON. Needs a real second workflow/port split to fix; tracked as a follow-up task rather than fixed inline for a UI-only change.

- `/login` and other pages behind `ProtectedRoute` render as a blank white page in this environment (pre-existing, unrelated to any one feature) — likely a missing shared layout wrapper/CSS var scope issue. Tracked as a follow-up task.
