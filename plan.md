# CONSOLE Club Platform — Development Plan

## 1. Project Overview
The CONSOLE Club Platform is a comprehensive, interactive, and minimalist web application designed to foster a competitive coding culture within the college. It will serve as a centralized hub for leaderboards, resources, daily challenges, event updates, and student profiles.

## 2. Technology Stack
*   **Frontend:** React (via Vite for fast builds), Tailwind CSS (for minimalist styling), Framer Motion (for micro-animations).
*   **Backend-as-a-Service (BaaS):** Supabase (provides PostgreSQL Database, Authentication, and Storage).
*   **Development Environment:** Docker & Supabase CLI (for running the complete Supabase stack locally, ensuring environment parity across the team).
*   **Third-Party APIs (Future Scope):** Codeforces API, LeetCode GraphQL (unofficial/scraped), CodeChef API (if available/scraped) for dynamic stat updates.

## 3. Role-Based Access Control (RBAC) Architecture
Utilizing Supabase Authentication and PostgreSQL Row Level Security (RLS), we will enforce the following roles:
*   **Super_Admin:** Full control. Can manage all content and access administrative capabilities. (Role stored in a custom `user_roles` table or JWT claims).
*   **Admin:** Content managers. Can post new POTDs, update resources, add events, and moderate discussion threads/comments. 
*   **Member:** Standard user. Can view all public pages, edit their own profile, submit POTD solutions, and participate in discussion threads. Requires college email ID for registration (enforced via Supabase Auth email allowlists).
*   *Security Note:* All tables will have strict RLS policies ensuring users can only edit their own data, while Admins have broader write access.

## 4. Directory & Folder Structure
By leveraging Supabase, we eliminate the need for a custom Express backend. The repository will contain the React client and Supabase configurations.

```text
console-website/
├── client/                     # React Frontend
│   ├── public/                 # Static assets (images, icons)
│   ├── src/
│   │   ├── assets/             # Global CSS, fonts
│   │   ├── components/         # Reusable UI components (Buttons, Cards, Navbar)
│   │   ├── hooks/              # Custom React hooks (e.g., useAuth, useSupabase)
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Route components (Home, Leaderboard, Profile, POTD)
│   │   ├── lib/                # Supabase client initialization (supabase.js)
│   │   ├── utils/              # Helper functions (date formatting, validators)
│   │   ├── App.jsx             # Main application component & Routing
│   │   └── main.jsx            # Entry point
│   ├── Dockerfile              # Frontend Docker configuration (dev)
│   ├── package.json
│   └── vite.config.js
│
├── supabase/                   # Supabase Configuration & Migrations
│   ├── migrations/             # SQL files for database schema and RLS policies
│   ├── seed.sql                # Initial mock data for local development
│   └── config.toml             # Local Supabase settings
│
├── .gitignore
├── docker-compose.yml          # Multi-container orchestration for the React Frontend (Supabase runs via its CLI/Docker under the hood)
├── README.md
└── plan.md                     # Project documentation (this file)
```

## 5. High-Level Database Schema (PostgreSQL)
*   **users (auth.users):** Managed by Supabase (Email, Password, Auth Provider).
*   **profiles:** UUID (refs auth.users), Name, College ID, Branch, Social Handles (CF, LC, CC, LinkedIn, GitHub), Skills (Array/JSON), Resume_URL, Role (Member/Admin).
*   **problems (POTD):** ID, Date, Title, Difficulty, Description, Solution (hidden until next day).
*   **submissions:** ID, User_ID (refs profiles), Problem_ID, Submission_Time, Status, Attempts.
*   **comments:** ID, User_ID (refs profiles), Target_ID (refs problems/events), Content, Created_At.
*   **events:** ID, Title, Date, Venue, Description, Image_URL.
*   **resources:** ID, Category, Title, URL, Description.

## 6. Implementation Roadmap (10-Day Sprint)
*Note: With a 3-member team, tasks should be highly parallelized.*

### Day 1-2: Foundation & Local Environment
*   **Setup:** Initialize the Git repository, define lockfiles (`package-lock.json`), and set up Vite/React.
*   **Supabase Local Dev:** Install Supabase CLI and Docker. Initialize the local Supabase project (`supabase init`, `supabase start`) so all 3 members have identical local databases.
*   **Auth & Schema:** Configure Supabase Auth (restrict to `@college_domain.edu`). Write initial SQL migrations for the `profiles` table and set up basic RLS policies.
*   **Base UI:** Build the main React layout (Navbar, Footer, Routing) with Tailwind CSS.

### Day 3-4: User Profiles & Leaderboard Core
*   **Profiles:** Develop the Profile page UI. Connect it to Supabase to let users update their handles, skills, and upload resumes (via Supabase Storage).
*   **Leaderboard (V1):** Build the Leaderboard UI. Fetch user profiles from Supabase. Initially use manual data or basic mock data.
*   **API Research:** One team member investigates fetching Codeforces/LeetCode data while others build the UI.

### Day 5-6: POTD & Static Content
*   **Database Design:** Write SQL migrations for `problems` and `submissions` tables with proper RLS (only Admins can insert problems).
*   **POTD:** Create the Admin UI to post daily problems. Build the Member UI to view them and submit status. 
*   **Content Pages:** Build the static/semi-dynamic pages for Resources, First-Year Tech Guide, Career Hub, Events, and FAQs.

### Day 7-8: Interactive Features & Community
*   **Discussions:** Implement real-time discussion threads under POTDs using Supabase real-time subscriptions.
*   **Search:** Develop a search bar to query the `profiles` table for users to look up other peers.
*   **Security Audit:** Ensure all RLS policies in Supabase are watertight (users can't delete others' comments, etc.).

### Day 9-10: Polish, Testing & Deployment
*   **UI/UX:** Apply the minimalist design theme fully. Add Framer Motion animations. Ensure mobile responsiveness.
*   **Testing:** End-to-end testing of user flows (Sign up -> Edit Profile -> View POTD -> Comment) against the local Supabase instance.
*   **Deploy:** Deploy the local Supabase project to the Supabase Cloud. Deploy the React frontend to Vercel/Netlify connected to the production Supabase instance.

## 7. Deployment Plan
*   **Frontend Deployment:** **Vercel** or **Netlify**. Both offer seamless CI/CD integration with GitHub.
*   **Backend, Auth & Database:** **Supabase Cloud**. Push local migrations to the hosted Supabase project. It automatically handles the PostgreSQL database, API, Auth, and Storage.
*   **Domain:** Purchase a custom domain (e.g., `consoleclub.in`) and link it to the Vercel frontend. Supabase handles its own API URLs, which can also be mapped to a custom domain on Pro tiers if needed.

## 8. Next Steps to Begin Development
1.  Initialize the Git repository.
2.  Install Docker Desktop and the Supabase CLI (`npm install -g supabase`).
3.  Run `supabase init` and `supabase start` to spin up the local backend environment.
4.  Run `npm create vite@latest client -- --template react` to bootstrap the frontend.
