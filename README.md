
# mail-pal

Your inbox doesn't know what matters. Job offers, invoices, and newsletters all get the same treatment — buried in chronological order. **mail-pal** fixes that: it connects to Gmail, classifies incoming mail by priority and category, and surfaces what actually needs your attention.

## Features

- 🔐 **Secure Google OAuth2 login** — sign in with your Google account, no passwords stored
- 📬 **Gmail integration** — crawls your inbox via the Gmail API and keeps it in sync
- 🏷️ **Priority classification** — automatic categorization (Professional, Academic, Logistics, etc.) with keyword-based rules you control
- 🔔 **Real-time notifications** — WebSocket-powered alerts the moment something important lands
- 🌗 **Dark mode** — full light/dark theme support
- 🔑 **API key access** — Argon2id-hashed keys for programmatic access to your prioritized inbox
- 🛡️ **Hardened auth** — HttpOnly cookie sessions, refresh token rotation, and IP-based rate limiting (no tokens ever touch client-side JS)

## Tech stack

**Backend**
- [Rust](https://www.rust-lang.org/) + [Axum](https://github.com/tokio-rs/axum) — async web framework
- [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) — serverless Postgres
- [Redis](https://redis.io/) via [Upstash](https://upstash.com/) — caching & rate limiting
- [Tokio](https://tokio.rs/) — background workers for Gmail crawling
- [sqlx](https://github.com/launchbadge/sqlx) — compile-time checked SQL
- Argon2id — password/API key/refresh token hashing
- JWT (access tokens) + rotating refresh tokens, delivered via HttpOnly cookies

**Frontend**
- [Next.js](https://nextjs.org/) (App Router)
- [Redux Toolkit](https://redux-toolkit.js.org/) — state management
- [Tailwind CSS v4](https://tailwindcss.com/) — styling, class-based dark mode
- WebSocket client for live notifications

## Architecture

```
┌─────────────┐      OAuth2       ┌──────────────┐
│   Browser    │ ────────────────▶│  Google OAuth │
│  (Next.js)   │◀──────────────── │              │
└──────┬───────┘   HttpOnly       └──────────────┘
       │            cookies
       │ REST + WS
       ▼
┌─────────────┐                   ┌──────────────┐
│  Rust/Axum   │ ────────────────▶│   Gmail API   │
│   Backend    │                  └──────────────┘
└──────┬───────┘
       │
   ┌───┴────┐
   ▼        ▼
┌──────┐ ┌───────┐
│Neon  │ │Upstash│
│(PG)  │ │(Redis)│
└──────┘ └───────┘
```

## Authentication flow

1. User clicks **Continue with Google** → redirected to Google's consent screen
2. Google redirects back to `/auth/google/callback` with an authorization code
3. Backend exchanges the code for Google tokens, fetches the user's profile, and finds/creates the user record
4. Backend issues a short-lived JWT (15 min) and a rotating refresh token (7 days), both set as **HttpOnly, SameSite cookies** — never exposed to JavaScript
5. Frontend reads only a non-sensitive `user_id` cookie to know it's logged in
6. When the access token expires, an axios interceptor silently calls `/auth/refresh` and retries the original request — no re-login required unless the refresh token itself has expired

This design keeps tokens completely inaccessible to any injected script, closing the XSS token-theft attack surface that comes with storing JWTs in `localStorage`.

## Getting started

### Prerequisites

- Rust (stable, 1.91+)
- Node.js 18+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech/) instance)
- A Redis instance (e.g. a free [Upstash](https://upstash.com/) instance)
- A Google Cloud project with OAuth2 credentials and the Gmail API enabled

### Backend setup

```bash
git clone https://github.com/<your-username>/mail-pal.git
cd mail-pal/backend

cp .env.example .env
# fill in DATABASE_URL, REDIS_URL, GOOGLE_CLIENT_ID,
# GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET, FRONTEND_URL

cargo build
cargo run
```

### Frontend setup

```bash
cd mail-pal/mail-pal-frontend

cp .env.example .env.local
# fill in NEXT_PUBLIC_API_URL

npm install
npm run dev
```

Visit `http://localhost:3000` and sign in with Google.

## Environment variables

**Backend (`.env`)**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `GOOGLE_REDIRECT_URI` | OAuth2 callback URL (e.g. `http://localhost:3001/auth/google/callback`) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `FRONTEND_URL` | Frontend origin, used for post-login redirect and CORS |
| `APP_ENV` | `production` enables `Secure` cookies; unset/dev otherwise |

**Frontend (`.env.local`)**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

## Roadmap

- [x] Rust/Axum backend with Gmail crawler and background workers
- [x] Google OAuth2 with secure HttpOnly cookie sessions
- [x] Priority classification + keyword management
- [x] Real-time WebSocket notifications
- [x] Dark mode
- [ ] Full Next.js + Redux Toolkit frontend (in progress)
- [ ] Custom classification rules per label/sender
- [ ] Mobile-responsive polish

