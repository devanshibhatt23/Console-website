# Console Website - Developer Setup Guide

This guide covers everything you need to know to run the Console Website locally, including the newly added Node.js backend (for the Leaderboard) and Supabase caching.

## Project Architecture
The project now consists of three main parts:
1. **Frontend (`/client`)**: React + Vite (Port `5173`)
2. **Backend Server (`/server`)**: Node.js + Express (Port `5000`) - *Handles external API fetching (Codeforces, LeetCode) to bypass CORS and rate limits.*
3. **Database**: Supabase (PostgreSQL)

---

## 🚀 Step 1: Supabase Setup (Database)

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

## 🚀 Step 2: Backend Setup (`/server`)

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

## 🚀 Step 3: Frontend Setup (`/client`)

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

## 📝 Recent Major Changes

1. **Premium Leaderboard UI**: Completely redesigned `/leaderboard` with dark mode, glassmorphism, glowing text, and smooth staggering animations.
2. **College ID Field**: Added a required **College ID** field (e.g. `2026BTCS001`) to the Dashboard profile section. This is used by the backend to automatically filter students into "First Year", "Second Year", etc., tabs on the leaderboard.
3. **API Rate Limit Fixes**: Removed CodeChef entirely due to the unreliable 402 proxy errors. Implemented a 30-minute persistent Supabase cache (`leaderboard_cache` table) for Codeforces and LeetCode to completely eliminate 429 errors when multiple users refresh the page.
