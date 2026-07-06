# 🚀 Project Setup

Follow these steps to set up the project locally.

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>/client
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `client` folder.

You can either:

- Copy `.env.example` and rename it to `.env`
- Or create a new `.env` file manually.

Add the following:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

### Where to find these values?

1. Open the shared **Supabase** project.
2. Navigate to:

```
Settings
└── API Keys
```

3. Copy:

- Project URL
- Publishable (Anon) Key

Paste them into your `.env` file.

> **Note:** Never commit your `.env` file.

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

# Current Routes

The following routes are currently available:

| Route | Description |
|--------|-------------|
| `/` | Login Page |
| `/signup` | Signup Page |
| `/dashboard` | Member Dashboard |
| `/admin` | Admin Dashboard |
| `*` | 404 Not Found |

### Example

To open the Signup page:

```
http://localhost:5173/signup
```

To open the Admin page:

```
http://localhost:5173/admin
```

---

# Authentication

### Signup

- Only **@mnit.ac.in** email addresses are allowed.
- Every successful signup:
  - Creates a user in **Supabase Auth**
  - Automatically creates a profile in the **profiles** table
  - Assigns the default role **member**

### Login

Use the credentials created during signup.

---

# Supabase

This project uses **one shared Supabase project**.

All team members must connect to the **same** Supabase backend.

Do **not** create a new Supabase project.

---

# Team Setup

Each developer should:

1. Clone the repository.
2. Create their own `.env` file.
3. Use the shared Supabase Project URL and Publishable Key.
4. Run:

```bash
npm install
npm run dev
```

---

# Git Workflow

Before starting work:

```bash
git pull origin main
```

Create your own feature branch:

```bash
git checkout -b feat-your-feature
```

Commit changes:

```bash
git add .
git commit -m "Your commit message"
git push origin feat-your-feature
```

Create a Pull Request before merging into `main`.

---

# Security Notes

- Do not commit `.env`
- Never expose the Supabase Service Role Key
- Only use the Publishable (Anon) Key in the frontend