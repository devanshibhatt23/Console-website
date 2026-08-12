<div align="center">

**The official web platform of CONSOLE — Tech Community**

*Your coding arc begins here.*

[![Live Site](https://img.shields.io/badge/Live%20Site-console.net.in-F2994A?style=for-the-badge&logo=vercel&logoColor=white)](https://console.net.in)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

</div>

---

## About

**CONSOLE** is a student-driven tech community that brings together developers, designers, and problem solvers. This repository is the full-stack source code for our official club website, serving as:

- A **public-facing landing page** showcasing our events, team, and community
- A **developer hub** for CONSOLE members with competitive programming profiles, leaderboards, and placement resources
- A **live contest tracker** with Problem of the Day (POTD), solve verification, and dynamic scoring
- An **admin dashboard** for club leads to manage events, members, and content

---

## Features

### Public (Guest) View

| Feature | Description |
|---|---|
| **Hero Section** | Animated terminal-style intro with RGB glitch hover effect on the CONSOLE title |
| **ASCII Logo** | Hand-crafted `</>` ASCII art with wave & glow hover effects |
| **About Us** | Club mission, values, and community overview |
| **Life at CONSOLE** | Photo gallery showcasing events and club culture |
| **Console Archive** | Horizontal scroll timeline of all past CONSOLE events with Minecraft-style cards |
| **Meet the Team** | Team profiles with animated cards |
| **FAQ** | Frequently asked questions |
| **Events Page** | Full list of upcoming & past events with registration links |

### Authenticated (Member) View

| Feature | Description |
|---|---|
| **Developer Dashboard** | Personal profile with Codeforces + LeetCode handles and stats |
| **Competitive Leaderboard** | Live-ranked leaderboard by CF + LC ratings with glassmorphism UI |
| **Problem of the Day (POTD)** | Daily coding challenge with automatic solve verification via Codeforces/LeetCode APIs |
| **POTD Leaderboard** | Ranked by dynamic score: 100 base pts + up to 50 speed bonus pts |
| **Resources Hub** | Curated domain-wise resource library (DSA, Web Dev, ML, etc.) |
| **Placement Playbook** | Interview prep roadmaps and placement resources |
| **Tech Guide** | Language and framework guides contributed by members |
| **Profile Search** | Search and view any CONSOLE member's public profile |

### Admin Panel

- Manage events (create, edit, delete, toggle registration)
- Approve/reject member registrations
- Set the active Problem of the Day
- View and manage all member profiles

---

## Project Architecture

```
Console-website/
├── client/          ← React + Vite frontend (deployed on Vercel)
│   └── src/
│       ├── pages/         ← Full page components (Landing, Dashboard, Events...)
│       ├── components/    ← Reusable UI components (Navbar, Hero, sections...)
│       ├── context/       ← Auth context (Supabase session management)
│       ├── services/      ← API call helpers (eventService, problemService...)
│       ├── hooks/         ← Custom React hooks
│       └── data/          ← Static data files
│
├── server/          ← Node.js + Express backend (deployed on Render)
│   └── index.js          ← CORS proxy for CF/LC, leaderboard cache, POTD scoring
│
├── supabase/        ← Database migrations and schema
│   └── migrations/
│
└── docker-compose.yml
```

**Data Flow:**

```
Browser  ──→  Vercel (React/Vite)  ──→  Supabase (Auth + DB)
                                   ──→  Render (Node.js)  ──→  Codeforces API
                                                           ──→  LeetCode API
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling** | Vanilla CSS + Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Authentication** | Supabase Auth (email/password) |
| **Database** | Supabase (PostgreSQL) with Row Level Security |
| **Backend** | Node.js + Express |
| **External APIs** | Codeforces API, LeetCode (GraphQL) |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Fonts** | Montserrat, Inter, JetBrains Mono, Press Start 2P, Menseal |

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Access to the CONSOLE Supabase project *(ask a team lead)*

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/devanshibhatt23/Console-website.git
cd Console-website
```

---

### Step 2 — Supabase Setup (Database)

1. **Install the Supabase CLI:**
   ```bash
   brew install supabase/tap/supabase
   # or: npm install -g supabase
   ```

2. **Authenticate:**
   ```bash
   supabase login
   ```
   *(Generate an access token at supabase.com → Account → Access Tokens)*

3. **Link to the CONSOLE project:**
   ```bash
   supabase link --project-ref <project-ref>
   ```
   *(Ask a team lead for the project ref and database password)*

4. **Pull migrations and start locally:**
   ```bash
   supabase db pull
   supabase start
   ```
   *Supabase Studio will be at `http://localhost:54323`*

---

### Step 3 — Backend Setup (`/server`)

The Express server acts as a CORS proxy and caching layer for the Codeforces and LeetCode APIs.

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create `server/.env`:**
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=5000
   ```
   > Note: The server uses the **Service Role Key** to bypass Row Level Security when writing leaderboard cache to the DB.

3. **Start the server:**
   ```bash
   node index.js
   ```
   You should see: *"Fetching fresh leaderboard data from external APIs..."*

---

### Step 4 — Frontend Setup (`/client`)

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Create `client/.env`:**
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

---

### Step 5 — Apply Database Migrations

Open Supabase Studio → SQL Editor, run each file in `supabase/migrations/` chronologically, or reset everything:

```bash
supabase db reset
```

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leaderboard` | Cached CF + LC leaderboard (refreshes every 30 min) |
| `GET` | `/api/leaderboard/refresh` | Force-refresh leaderboard from external APIs |
| `GET` | `/api/potd/leaderboard-live` | Live POTD solve rankings with dynamic scoring |
| `GET` | `/api/events` | Upcoming events list |
| `GET` | `/api/profile/:handle` | CF/LC profile stats for a handle |

---

## POTD Scoring System

The Problem of the Day leaderboard uses a dynamic scoring model:

```
Total Score  =  Base Points  +  Speed Bonus

Base Points  :  100 pts per solved POTD
Speed Bonus  :  Up to 50 pts, linearly decreasing over 24h from problem publish time
                → Full 50 pts if solved within minutes of posting
                → 0 pts if solved exactly 24h later

Tiebreakers  :  1. Total score       (descending)
                2. Total POTDs solved (descending)
                3. Last solve time   (ascending — earliest wins)
```

---

## Important Files

| File | Purpose |
|---|---|
| `client/src/pages/Landing.tsx` | Home page — hero, about, events, gallery, timeline |
| `client/src/components/sections/Hero.tsx` | Animated hero with ASCII logo and glitch effect |
| `client/src/components/sections/OurJourney.tsx` | Horizontal scroll event timeline |
| `client/src/pages/Dashboard.jsx` | Member developer hub |
| `client/src/pages/POTD.jsx` | Problem of the Day with auto solve verification |
| `client/src/pages/Admin.jsx` | Admin panel for club leads |
| `client/src/context/AuthContext.tsx` | Supabase auth session provider |
| `server/index.js` | Express API server with CF/LC proxy and caching |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with a clear message: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request against `main`

Please follow existing code style. TypeScript is preferred for new components. New pages go in `client/src/pages/`, reusable UI in `client/src/components/`.

---

## License

This project is the property of **CONSOLE — Tech Community**.  
All rights reserved © 2026–27 CONSOLE.

---

<div align="center">

Star this repo if you're part of the CONSOLE community.

`< / >` &nbsp;·&nbsp; [console.net.in](https://console.net.in) &nbsp;·&nbsp; CONSOLE

</div>
