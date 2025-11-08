# Tolu John Artist Platform

A full-stack, production-ready web experience for Nigerian gospel artist **Tolu John**. Inspired by the aesthetic and content structure of Tauren Wells, the platform delivers a premium landing site, rich media catalogue, tour schedule, merch storefront, and a secure admin console for managing all content.

## Tech Stack

- **Frontend:** React (Create React App + TypeScript), Tailwind CSS, React Router, TanStack Query, Zustand
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Express Validator
- **Tooling:** Nodemon, Axios, React Icons, Morgan, Helmet, CORS

## Features

- **Immersive landing page** with hero highlight, about story, live tour section, latest video embed, music spotlight, merch teaser, subscription CTA, and footer with socials.
- **Dedicated pages** for About, Music catalogue, Videos, Tour dates, Merch store, Subscribe flow, and Contact form.
- **Admin Dashboard** featuring authentication, personalized profile, KPIs, and CRUD management for hero content, biography, tracks, videos, tour dates, merch, subscribers, and messages.
- **API-first architecture** exposing public endpoints for the frontend and protected admin endpoints behind JWT.
- **Seed script** with carefully curated dummy data to showcase the experience instantly.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or remote)

### 1. Clone & Install

```bash
git clone <repo-url> tolujohn
cd tolujohn
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env    # update with your Mongo URI & secrets
npm run seed            # populate database with sample content
npm run dev             # start Express API on http://localhost:5000
```

#### Frontend

```bash
cd ../frontend_cra
npm install
cp .env.example .env    # optional override for API base URL
npm start               # launch React app on http://localhost:3000
```

By default, the frontend proxies API requests to `http://localhost:5000/api`.

---

## Environment Variables

### Backend `.env`

| Variable        | Description                                |
|-----------------|--------------------------------------------|
| `PORT`          | API port (default 5000)                    |
| `MONGO_URI`     | MongoDB connection string                  |
| `JWT_SECRET`    | Secret used to sign admin JWT tokens       |
| `JWT_EXPIRES_IN`| Token lifespan (e.g., `7d`)                |
| `ALLOWED_ORIGINS` | Whitelisted origins for CORS (comma list) |

### Frontend `.env`

| Variable                 | Description                               |
|--------------------------|-------------------------------------------|
| `REACT_APP_API_BASE_URL` | API base URL (defaults to `/api`)         |

---

## Seed Data & Admin Login

The `npm run seed` script creates a complete data set for immediate testing:

- **Admin user:** `admin@tolujohnmusic.com` / `ChangeMe123!`
- Featured hero highlight, biography, tracks, videos, tour schedule, merch items, subscribers, and a sample message.

> **Security tip:** Change the seeded admin password in production by editing the database or using the profile settings page after logging in.

---

## API Overview

### Public (no auth, base path `/api/public`)

| Method & Path            | Description |
|-------------------------|-------------|
| `GET /api/public/home`  | Returns hero highlight, about snapshot, upcoming tour dates, featured video, curated music list, and merch highlights for the landing page. |
| `GET /api/public/music` | Lists all published tracks ordered by release date. |
| `GET /api/public/videos`| Lists all published videos ordered by release date. |
| `GET /api/public/tour-dates` | Lists upcoming tour dates (use `?includePast=true` to include previous shows). |
| `GET /api/public/merch` | Lists merch items currently in the catalogue. |
| `POST /api/public/subscribe` | Adds an email to the subscriber list. Body: `{ email }`. |
| `POST /api/public/contact` | Records a booking/contact inquiry. Body: `{ name, email, message }`. |

### Authentication (`/api/auth`)

| Method & Path       | Description |
|--------------------|-------------|
| `POST /api/auth/login` | Authenticate admin. Body: `{ email, password }`. Returns JWT + profile. |
| `GET /api/auth/me`  | Returns current admin profile (requires `Authorization: Bearer <token>`). |
| `PUT /api/auth/me`  | Updates profile or password. Body: `{ name?, email?, currentPassword?, newPassword? }`. |

### Admin (requires JWT, base path `/api/admin`)

| Method & Path | Description |
|---------------|-------------|
| `GET /api/admin/dashboard` | Returns summary metrics for tracks, videos, tours, subscribers, and unread messages. |
| `GET /api/admin/hero` / `PUT /api/admin/hero` | Retrieve or upsert the landing-page hero highlight. |
| `GET /api/admin/about` / `PUT /api/admin/about` | Retrieve or upsert the about content block. |
| `GET /api/admin/tracks` | List tracks. |
| `POST /api/admin/tracks` | Create a track. |
| `PUT /api/admin/tracks/:id` | Update a track. |
| `DELETE /api/admin/tracks/:id` | Delete a track. |
| `GET /api/admin/videos` | List videos. |
| `POST /api/admin/videos` | Create a video entry. |
| `PUT /api/admin/videos/:id` | Update a video entry. |
| `DELETE /api/admin/videos/:id` | Delete a video entry. |
| `GET /api/admin/tours` | List tour dates. |
| `POST /api/admin/tours` | Create a tour date. |
| `PUT /api/admin/tours/:id` | Update a tour date. |
| `DELETE /api/admin/tours/:id` | Delete a tour date. |
| `GET /api/admin/merch` | List merch items. |
| `POST /api/admin/merch` | Create a merch item. |
| `PUT /api/admin/merch/:id` | Update a merch item. |
| `DELETE /api/admin/merch/:id` | Delete a merch item. |
| `GET /api/admin/subscribers` | List newsletter subscribers. |
| `GET /api/admin/messages` | List contact form submissions. |
| `PUT /api/admin/messages/:id/status` | Update a message status (`new`, `in-progress`, `resolved`). |

---

## Project Structure

```
backend/
  src/
    config/        # database connection
    controllers/   # route handlers
    middleware/    # auth & error handling
    models/        # Mongoose schemas
    routes/        # Express routers
    utils/         # helpers & logger
  scripts/seed.js  # seed & destroy utilities

frontend/
  src/
    components/    # shared UI parts (header, footer, protection)
    layouts/       # site & admin shells
    pages/         # route-level pages (public + admin)
    sections/      # landing page building blocks
    store/         # Zustand auth store
    lib/           # API client
    types/         # shared TypeScript models
```

---

## Suggested Next Steps

- Configure production deployments (Vercel/Netlify for frontend, Render/Fly/Heroku for backend).
- Plug in real MongoDB Atlas connection and update environment secrets.
- Integrate media uploads (e.g., Cloudinary) for cover art and hero backgrounds.
- Add analytics or CRM integrations for subscriber exports.
- Extend admin with role-based permissions if multiple managers are expected.

Enjoy building with excellence for Tolu John!

