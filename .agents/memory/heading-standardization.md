---
name: Heading standardization
description: Canonical heading style used across all individual pages; also covers git commit authorship rule for this project.
---

## Canonical page heading style

All top-level page headings (Leaderboard, Events, TechGuide, Resources, POTD, MeetTheTeam) use:

```css
font-size: clamp(48px, 7vw, 72px);
font-weight: 900;
font-family: 'Montserrat', sans-serif;
letter-spacing: -0.02em;
background: linear-gradient(90deg, #F2994A, #F0405C);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
display: inline-block;
cursor: default;
transition: transform 0.3s ease, filter 0.3s ease;
```

Hover:
```css
transform: scale(1.02);
filter: drop-shadow(0 0 14px rgba(242,153,74,0.7)) drop-shadow(0 0 28px rgba(240,64,92,0.4));
```

CSS classes per page:
- Leaderboard: `.leaderboard-title` in Leaderboard.css
- Events: `.ev-hero-title` in Events.css
- TechGuide: `.tg-h1` in TechGuide.css
- Resources: `.res-hero-title` in Resources.css (hover on h1, gradient on inner span `.res-hero-title-gradient`)
- POTD: `.potd-title-main` in DashboardPOTD.css
- MeetTheTeam page: inline `headingStyle` CSSProperties object

## Loader rule

`App.tsx` initializes `loading` state as `useState(() => window.location.pathname === '/')` so the boot terminal only plays on the home page.

## Git commit authorship

ALL commits to the `fix-bugs` branch must use:
- username: `devanshibhatt23`
- email: `dbhatt2310@gmail.com`

Command: `git commit --author="devanshibhatt23 <dbhatt2310@gmail.com>" -m "..."`

**Why:** Explicit requirement from the project owner.
