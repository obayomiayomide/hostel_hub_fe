# Student Hostel Allocation Management System — Frontend

A **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS** frontend for the
web-based student hostel allocation management system.

## Tech Stack

- Next.js 14 (App Router, Client Components)
- TypeScript
- Tailwind CSS (custom design tokens)
- Axios (API client with JWT interceptor)
- React Hook Form + Zod (form validation)
- Recharts (admin analytics charts)
- Lucide React (icons)
- react-hot-toast (notifications)
- js-cookie (session storage)

## Features

- Public landing page + student registration/login
- **Student Portal**: browse hostels & rooms, apply for accommodation, pay fees
  (simulated gateway flow), view allocation status, raise & track maintenance
  requests, manage profile
- **Admin / Warden Console**: analytics dashboard with charts (occupancy,
  application pipeline, revenue), hostel & room/bed management, application
  review (approve/reject/allocate), allocation management (manual/auto/vacate),
  payment records, maintenance ticket resolution, user & academic session
  management
- Role-based route protection (student vs. admin/warden)
- Fully wired to the backend REST API — every screen calls a real endpoint

## Getting Started

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```
Set `NEXT_PUBLIC_API_URL` to point at your running backend, e.g.
`http://localhost:5000/api/v1`.

### 3. Run the development server
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
npm start
```

## Demo Accounts (after running the backend's `npm run seed`)

| Role    | Email               | Password      |
|---------|----------------------|---------------|
| Admin   | admin@hostel.edu     | Admin@12345   |
| Warden  | warden@hostel.edu    | Warden@123    |
| Student | student@hostel.edu   | Student@123   |

## Project Structure

```
src/
  app/                # Next.js App Router pages
    (auth)/            # Login & register
    student/           # Student portal (protected)
    admin/             # Admin/warden console (protected)
  components/
    ui/                # Reusable design-system primitives (Button, Input, Modal, Table...)
    layout/            # Sidebar, Topbar, DashboardShell
    forms/             # Modal forms (Hostel, Room, Payment)
  services/            # One file per backend resource — every API call lives here
  context/             # AuthContext (session state)
  hooks/                # useRequireAuth route guard
  lib/                  # axios instance, utils
  types/                # Shared TypeScript types mirroring the Prisma schema
```

## Connecting to the Backend

This frontend expects the backend described in the accompanying `backend/`
folder, exposing a REST API at `/api/v1/*`. Every service in `src/services`
maps 1:1 to a backend route — see the backend README for the full endpoint list.

## Notes on Authentication

Sessions are stored in a cookie (`hms_token` / `hms_user`) and routes are
guarded client-side via `useRequireAuth`. For a production deployment behind
a CDN, consider migrating to Next.js Middleware + httpOnly cookies for
stronger security; the current approach is intentionally simple for clarity
and ease of grading/demoing this academic project.
