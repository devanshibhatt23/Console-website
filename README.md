# Console Website - Developer Setup Guide 

This guide covers everything you need to know to run the Console Website locally, including the newly added Node.js backend (for the Leaderboard) and Supabase caching.

## Project Architecture
The project now consists of three main parts:
1. **Frontend (`/client`)**: React + Vite (Port `5173`) - *Includes the main Leaderboard and the new POTD Leaderboard pages.*
2. **Backend Server (`/server`)**: Node.js + Express (Port `5000`) - *Handles external API fetching (Codeforces, LeetCode info, and automated recent submissions for POTD solve verification) to bypass CORS and rate limits.*
3. **Database**: Supabase (PostgreSQL) - *Stores problems, profiles, submissions, and cached leaderboards.*

---

## Step 1: Supabase Setup (Database)

We use Supabase for authentication and our database. The Leaderboard now uses a `leaderboard_cache` table to prevent external API rate limits.

1. **Install Supabase CLI** (if you haven't already):
   ```bash
   brew install supabase/tap/supabase
   # Or npm install -g supabase
   ```

2. **Authenticate the CLI**:
   - Go to [supabase.com](https://supabase.com), log in, go to Account Settings > Access Tokens.
   - Generate a new token and copy it.
   - Run the login command and paste your token:
     ```bash
     supabase login
     ```

3. **Link to our remote project**:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
   *(Ask the team lead for the project ref and database password if you don't have it).*

4. **Pull latest migrations & Start local Supabase**:
   ```bash
   supabase db pull
   supabase start
   ```
   *(This starts the local Supabase studio on `http://localhost:54323`)*

---

## Step 2: Backend Setup (`/server`)

The backend is required to fetch live Codeforces and LeetCode ratings without hitting rate limits.

1. **Navigate and install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file inside the `server/` folder:
   ```env
   # Find these in your local Supabase Studio or remote Dashboard
   VITE_SUPABASE_URL=http://localhost:54321
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   PORT=5000
   ```
   *Note: The server uses the **Service Role Key** so it can bypass Row Level Security (RLS) to update the leaderboard cache.*

3. **Start the backend**:
   ```bash
   node index.js
   ```
   *You should see: "Fetching fresh leaderboard data from external APIs..."*

---

## Step 3: Frontend Setup (`/client`)

1. **Navigate and install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Environment Variables**:
   Ensure you have a `.env` file in the `client/` folder:
   ```env
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

---

## Step 4: POTD Leaderboard Setup & Local Testing

To run and test the new Problem of the Day (POTD) Leaderboard locally:

1. **Apply the Migration**:
   - Open your Supabase project dashboard -> SQL Editor -> Create a new query.
   - Copy the contents of the database migration file [20260708000000_potd_leaderboard.sql](file:///c:/Users/prart/Console-website/supabase/migrations/20260708000000_potd_leaderboard.sql) into the SQL editor and click **Run**.

2. **Start the Backend Server**:
   - Navigate to `/server` and run:
     ```bash
     node index.js
     ```
   - On startup, the backend server will automatically connect to Supabase, query Codeforces and LeetCode API submissions for active POTDs, record successful solves to the database, and compile the POTD cache.

3. **Verify the Point Calculation System**:
   - The backend computes developer scores based on speed and completion quality:
     - **Base Points**: 100 points per solved POTD.
     - **Speed Bonus**: Up to 50 points extra, linearly scaling down to 0 over 24 hours from when the POTD was posted. Full 50 points are awarded if solved before or at the moment of the post.
     - **Ties**: Resolved primarily by total points, then total number of POTDs solved, and finally by the developer who reached their last solve earliest (ascending order of the last solve timestamp).

4. **Verify Endpoint outputs**:
   - Trigger a live fetch to update rankings: `GET http://localhost:5000/api/potd/leaderboard-live`
   - Observe the returned payload contains `score` (points) and `questions` (solved count) separated correctly and sorted according to the priorities above.

5. **Verify on the Frontend**:
   - Start the React client in `/client` via `npm run dev`.
   - Open `http://localhost:5173/` and navigate to **Problem of the Day** on your Developer Hub.
   - Verify that the compact **Overall POTD Leaderboard** displays Rank, Developer, Score (e.g. `150 pts` badge), and Streak, and applies Gold, Silver, and Bronze highlights to the top 3 rows.
   - Click **View All** to navigate to `/potd-leaderboard`. Verify that it displays: Rank, Developer Name, Handles, Total Score, POTDs Solved, and Streak columns.

---

## Recent Major Changes

1. **Premium Leaderboard UI**: Completely redesigned `/leaderboard` with dark mode, glassmorphism, glowing text, and smooth staggering animations.
2. **College ID Field**: Added a required **College ID** field (e.g. `2026BTCS001`) to the Dashboard profile section. This is used by the backend to automatically filter students into "First Year", "Second Year", etc., tabs on the leaderboard.
3. **API Rate Limit Fixes**: Removed CodeChef entirely due to the unreliable 402 proxy errors. Implemented a 30-minute persistent Supabase cache (`leaderboard_cache` table) for Codeforces and LeetCode to completely eliminate 429 errors when multiple users refresh the page.
4. **POTD Point & Score System**: Upgraded the Problem of the Day (POTD) leaderboard (`/potd-leaderboard` and `GET /api/potd/leaderboard-live`) from simply counting solved problems (1 point per solve) to a dynamic scoring model. It awards **100 base points** + up to **50 speed bonus points** depending on how quickly the challenge was solved after its publish time. The UI displays highlighted score badges, gold/silver/bronze highlights for top 3 rows, and ranks developers by their overall score with proper tie-breaking logic. Allows anonymous developers with missing name fields in their profile to still be ranked on the leaderboard.
