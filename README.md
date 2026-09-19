# PawConnect — Pet Adoption Platform

PawConnect is a full-stack MERN pet-adoption platform. Visitors can browse adoptable pets and submit adoption applications; registered users can track their requests; shelter administrators get a dashboard to manage pets, users, and adoption decisions.

## Tech stack

**Client:** React 19, Vite, React Router, Axios, Tailwind CSS, Lucide React, React Toastify
**Server:** Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcryptjs

## Project structure

```
pawconnect/
├── client/          # Vite + React frontend
│   └── src/
│       ├── pages/
│       │   ├── public/   # Home, Browse Pets, Pet Details, How It Works, About, Contact, Privacy, Auth
│       │   ├── user/     # Dashboard, My Requests, Profile
│       │   └── admin/    # Admin Dashboard
│       ├── components/   # Navbar, ProtectedRoute, forms, shared UI
│       ├── context/       # AuthContext
│       └── services/      # api.js + per-feature API clients
└── server/          # Express API
    ├── controllers/
    ├── models/       # User, Pet, AdoptionRequest
    ├── routes/
    ├── middleware/    # auth (protect / adminOnly), error handling
    └── seed.js        # Demo accounts + 18 sample pets
```

## Prerequisites

- Node.js 20 or later
- A MongoDB Atlas cluster (or local MongoDB instance)

## Installation

```bash
npm run install:all
```

This installs the root, `client`, and `server` dependencies in one step.

## Environment variables

Create a `.env` file in `server/` (see `.env.example` if present) with:

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on (defaults to `5000`) |
| `MONGODB_URI` | MongoDB Atlas / local connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. `http://localhost:5173`) |

> If you see a MongoDB connection error mentioning an IP whitelist, add your current IP (or `0.0.0.0/0` for dev only) under **Network Access** in your Atlas project.

## Seed demo data

Once `MONGODB_URI` is set, populate demo accounts and 18 sample pets:

```bash
npm run seed --prefix server
```

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@pawconnect.demo` | `Demo@123` |
| User | `user@pawconnect.demo` | `Demo@123` |

## Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API health check: `http://localhost:5000/api/health`

Or run each side independently: `npm run client` / `npm run server`.

## Frontend routes

| Path | Access | Page |
| --- | --- | --- |
| `/` | Public | Home |
| `/pets` | Public | Browse Pets |
| `/pets/:id` | Public | Pet Details |
| `/how-it-works`, `/about`, `/contact`, `/privacy` | Public | Info pages |
| `/login`, `/register` | Public | Auth |
| `/dashboard` | Logged-in user | User dashboard |
| `/my-requests` | Logged-in user | My adoption requests |
| `/profile` | Logged-in user | Profile settings |
| `/admin` | Admin only | Admin dashboard |
| `*` | — | Falls back to the About page |

## API reference

### Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a standard user and receive a JWT |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the authenticated user's profile |

### Pets

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/pets` | Public | List pets; supports search and filters |
| GET | `/api/pets/:id` | Public | Get pet details |
| POST | `/api/pets` | Admin | Add a pet |
| PUT | `/api/pets/:id` | Admin | Update a pet |
| DELETE | `/api/pets/:id` | Admin | Delete a pet |

Example filter request: `/api/pets?search=luna&species=Cat&gender=Female&location=Delhi&status=Available`.

### Adoptions

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/adoptions` | User | Submit an adoption application |
| GET | `/api/adoptions/my` | User | View personal adoption requests |
| DELETE | `/api/adoptions/:id` | User | Cancel a pending request |
| GET | `/api/adoptions` | Admin | List all adoption requests |
| PUT | `/api/adoptions/:id/status` | Admin | Approve or reject a pending request |

### Users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/users/:id` | Owner/Admin | Get a profile |
| PUT | `/api/users/:id` | Owner/Admin | Update basic profile details |
| GET | `/api/users` | Admin | List registered users |

### Admin

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics and recent requests |

## Notes

- `AdminDashboardPage` (`/admin`) calls `GET /api/admin/dashboard`, protected by the `protect` + `adminOnly` middleware, and surfaces total/available/adopted pets, pending requests, total users, and the 5 most recent adoption requests.
- `ProtectedRoute` accepts an `adminOnly` prop; non-admins hitting `/admin` are redirected to `/dashboard`, and logged-out users are redirected to `/login`.
- Never commit `.env` files or real Atlas credentials — `.gitignore` already excludes `.env`, `server/.env`, and `client/.env`.
