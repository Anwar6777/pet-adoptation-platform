# PawConnect — Pet Adoption Platform

PawConnect is a full-stack MERN pet-adoption platform. Visitors can browse adoptable pets and submit adoption applications; registered users can track their requests; shelter administrators get a dashboard to manage pets, users, and adoption decisions.

## Tech stack

**Client:** React 19, Vite, React Router, Axios, Tailwind CSS, Lucide React, React Toastify  
**Server:** Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcryptjs

## Project structure

```
pawconnect/
├── client/          # Vite + React frontend
└── server/          # Express API, MongoDB models, routes and controllers
```

## Prerequisites

- Node.js 20 or later
- MongoDB Atlas or a local MongoDB instance

## Installation

```bash
npm run install:all
```

## Configure the server

Copy `server/.env.example` to `server/.env`, then set your MongoDB connection string and a private JWT secret. The API will not start until both `MONGODB_URI` and `JWT_SECRET` are configured and MongoDB is reachable.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (defaults to `5000`) |
| `MONGODB_URI` | MongoDB Atlas / local connection string |
| `JWT_SECRET` | Long, random secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime (defaults to `7d`) |
| `CLIENT_URL` | Frontend origin for CORS (defaults to `http://localhost:5173`) |

For MongoDB Atlas connection errors mentioning an IP whitelist, add your current IP under Network Access in your Atlas project. Do not use `0.0.0.0/0` in production.

## Seed demo data

After configuring MongoDB, run:

```bash
npm run seed --prefix server
```

The seed script is safe to run more than once: it adds missing demo accounts and sample pets without deleting or overwriting existing users, pets, or adoption requests.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@pawconnect.demo` | `Demo@123` |
| User | `user@pawconnect.demo` | `Demo@123` |

Change demo credentials before deploying publicly.

## Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API health check: `http://localhost:5000/api/health`

Or run each side independently with `npm run client` and `npm run server`.

## Main frontend routes

| Path | Access | Page |
| --- | --- | --- |
| `/`, `/pets`, `/pets/:id` | Public | Home, browse pets, pet details |
| `/how-it-works`, `/about`, `/contact`, `/privacy` | Public | Information pages |
| `/login`, `/register` | Public | Authentication |
| `/dashboard`, `/my-requests`, `/profile` | Signed-in user | User dashboard, requests and profile |
| `/admin` | Admin only | Shelter administration |

## API overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Pets: `GET /api/pets`, `GET /api/pets/:id`, admin-only create/update/delete
- Adoptions: signed-in users submit, view and cancel their requests; admins review requests
- Users: users manage their own profile; admins manage users
- Admin: `GET /api/admin/dashboard`

All protected API requests use `Authorization: Bearer <token>`.

## Security and configuration notes

- Never commit `.env` files or real database credentials.
- The API connects to MongoDB before opening its HTTP port, so a broken database configuration fails visibly instead of leaving a half-working server running.
- The health endpoint is available at `/api/health` after successful database connection.
