# CONSOLE Club Platform — Development Plan

## 1. Project Overview
The CONSOLE Club Platform is a comprehensive, interactive, and minimalist web application designed to foster a competitive coding culture within the college. It will serve as a centralized hub for leaderboards, resources, daily challenges, event updates, and student profiles.

## 2. Technology Stack
*   **Frontend:** React (via Vite for fast builds), Tailwind CSS (for minimalist, custom styling), Framer Motion (for subtle micro-animations)
*   **Backend:** Node.js with Express.js
*   **Database:** MongoDB (using Mongoose for ODM)
*   **Authentication & RBAC:** Clerk (highly suitable for React/Express with built-in RBAC)
*   **Third-Party APIs (Future Scope):** Codeforces API, LeetCode GraphQL (unofficial/scraped), CodeChef API (if available/scraped) for dynamic stat updates.

## 3. Role-Based Access Control (RBAC) Architecture
Utilizing Clerk's organization/role features or custom metadata, we will enforce the following roles:
*   **Super_Admin:** Full control. Can assign 'Admin' roles, manage all content, edit any profile, delete comments, and access administrative dashboards.
*   **Admin:** Content managers. Can post new POTDs, update resources, add events, and moderate discussion threads/comments. Cannot manage other admins.
*   **Member:** Standard user. Can view all public pages, edit their own profile, submit POTD solutions, and participate in discussion threads. Requires college email ID for registration (enforced via Clerk allowlists or email domain validation).

## 4. Directory & Folder Structure
We will use a monorepo-style structure to keep the frontend and backend together for easier local development.

```text
console-website/
├── client/                     # React Frontend
│   ├── public/                 # Static assets (images, icons)
│   ├── src/
│   │   ├── assets/             # Global CSS, fonts
│   │   ├── components/         # Reusable UI components (Buttons, Cards, Navbar)
│   │   ├── contexts/           # React Contexts (Theme, Auth state wrapper if needed)
│   │   ├── hooks/              # Custom React hooks (e.g., useFetch)
│   │   ├── layouts/            # Page layouts (e.g., MainLayout, DashboardLayout)
│   │   ├── pages/              # Route components (Home, Leaderboard, Profile, POTD)
│   │   ├── services/           # API call logic (Axios/Fetch instances)
│   │   ├── utils/              # Helper functions (date formatting, validators)
│   │   ├── App.jsx             # Main application component & Routing
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── config/                 # Environment variables, DB connection
│   ├── controllers/            # Request handling logic (userController, potdController)
│   ├── middlewares/            # Clerk Auth validation, RBAC checks, Error handling
│   ├── models/                 # Mongoose schemas (User, Problem, Comment, Event)
│   ├── routes/                 # Express routes mapping to controllers
│   ├── services/               # Complex business logic, external API fetching (CF, LeetCode)
│   ├── utils/                  # Helper functions
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── plan.md                     # Project documentation (this file)
```

## 5. High-Level Database Schema (MongoDB)
*   **User:** Clerk ID, College Email, Name, College ID, Branch, Social Handles (CF, LC, CC, LinkedIn, GitHub), Skills (Array), Resume URL, Daily Heatmap Data, Role (mapped from Clerk).
*   **POTD (Problem of the Day):** Date, Title, Difficulty, Description, Solution (hidden until next day).
*   **Submission (POTD):** UserID, POTDID, Submission Time, Status (Correct/Incorrect), Attempts.
*   **Comment/Discussion:** UserID, TargetID (POTD/Contest), Content, Timestamp.
*   **Event:** Title, Date, Venue, Description, Image URL.
*   **Resource:** Category (DSA, ML, Web3), Title, URL, Description.

## 6. Implementation Roadmap (10-Day Sprint)
*Note: With a 3-member team, tasks should be highly parallelized. Assign one person to Frontend, one to Backend/DB, and one to Integration/Auth.*

### Day 1-2: Foundation & Authentication
*   **Setup:** Initialize the Git repository, folder structure, and install core dependencies.
*   **Database:** Configure MongoDB Atlas and build the core Mongoose schemas (User, Problem).
*   **Auth:** Integrate Clerk, enforce `@college_domain.edu` sign-ups, and establish RBAC middleware.
*   **Base UI:** Setup Vite + React + Tailwind CSS and build the main layout (Navbar, Footer, Routing).

### Day 3-4: User Profiles & Leaderboard Core
*   **Profiles:** Develop the Profile page (frontend forms for skills, handles, resume upload) and the corresponding backend API to save data.
*   **Leaderboard (V1):** Build the Leaderboard UI and backend endpoints. Initially use manual data or basic mock data.
*   **API Research:** One team member investigates fetching Codeforces/LeetCode data while others build the UI.

### Day 5-6: POTD & Static Content
*   **POTD:** Create the Admin UI to post daily problems. Build the Member UI to view them and submit status. Add the POTD daily leaderboard logic.
*   **Content Pages:** Build the static/semi-dynamic pages for Resources, First-Year Tech Guide, Career Hub, Events, and FAQs.

### Day 7-8: Interactive Features & Community
*   **Discussions:** Implement discussion threads and commenting functionality under POTDs.
*   **Search:** Develop a search bar and backend query logic for users to look up other profiles.
*   **Integration:** Ensure Clerk RBAC is actively protecting admin actions (like posting POTDs or deleting comments).

### Day 9-10: Polish, Testing & Deployment
*   **UI/UX:** Apply the minimalist design theme fully. Add subtle Framer Motion animations. Ensure mobile responsiveness.
*   **Testing:** End-to-end testing of user flows (Sign up -> Edit Profile -> View POTD -> Comment).
*   **Deploy:** Deploy Frontend (Vercel/Netlify) and Backend (Render/Railway). Connect the custom domain.

## 7. Deployment Plan
*   **Frontend Deployment:** **Vercel** or **Netlify**. Both offer seamless CI/CD integration with GitHub, excellent performance for React/Vite apps, and easy environment variable management.
*   **Backend Deployment:** **Render** or **Railway**. Cost-effective, easy to deploy Node.js/Express applications, and provides automated deployments from GitHub.
*   **Database:** **MongoDB Atlas** (Cloud). Use the free tier initially, scalable as the platform grows.
*   **Media/File Storage (Resumes, Event Images):** **Cloudinary** or **AWS S3** (accessed via backend or signed URLs) to avoid bloating the database.
*   **Domain:** Purchase a custom domain (e.g., `consoleclub.in`) and map subdomains (e.g., `api.consoleclub.in` for backend).

## 8. Next Steps to Begin Development
1.  Initialize the Git repository.
2.  Set up the Clerk application in the Clerk Dashboard.
3.  Set up a new MongoDB cluster.
4.  Run `npm init` / `npm create vite@latest` to bootstrap the folders.
