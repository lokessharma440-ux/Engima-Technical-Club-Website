# API Reference

The backend exposes a JSON REST API under the `/api` prefix.

## Public Routes (`/api`)

These routes do not require authentication and are used by the public-facing frontend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Fetch all events (upcoming and previous) |
| GET | `/api/events/upcoming` | Fetch upcoming events (sorted chronologically) |
| GET | `/api/events/:slug` | Fetch details of a specific event by its slug |
| POST | `/api/events/:id/register` | Register a user for an event. Expects JSON body with user details. Returns a secure `qrToken`. |
| GET | `/api/members` | Fetch all team members and mentors |
| GET | `/api/achievements` | Fetch all achievements |
| GET | `/api/projects` | Fetch all projects |

---

## Admin CMS Routes (`/api/admin`)

**Authentication Requirement:** All routes under `/api/admin` strictly require a valid JWT `adminToken` provided via an HttpOnly cookie.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Authenticates the admin using `username` and `password`. Sets HttpOnly cookie on success. |
| POST | `/api/admin/logout` | Clears the `adminToken` cookie. |
| GET | `/api/admin/me` | Validates the current session token. |
| GET | `/api/admin/dashboard` | Returns aggregate metrics (Total members, projects, upcoming events, etc.) |

### Event Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/events` | Fetch all events (including sensitive fields like participant lists) |
| POST | `/api/admin/events` | Create a new event. Accepts `multipart/form-data` for image uploads (`image`, `bannerImage`). |
| PUT | `/api/admin/events/:id` | Update an event. Accepts `multipart/form-data`. |
| DELETE | `/api/admin/events/:id` | Delete an event. |
| POST | `/api/admin/events/:id/gallery` | Upload multiple images to an event's gallery. |
| PUT | `/api/admin/events/:id/gallery/remove` | Remove a specific image from the gallery. |

### Registration & Attendance Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/events/:eventId/registrations` | Fetch all registrations for a specific event. |
| GET | `/api/admin/events/:eventId/attendance/stats` | Fetch real-time attendance statistics (Total vs Attended). |
| GET | `/api/admin/events/:eventId/registrations/export` | Download a CSV file of all registrations (secure tokens excluded). |
| POST | `/api/admin/attendance/verify` | Used by the QR Scanner. Accepts `{ qrToken }`. Verifies token and marks attendance as `true`. |

### Generic CRUD Endpoints
The following endpoints exist for `members`, `achievements`, `projects`, `resources`, `blogs`, `leaderboard`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/<entity>` | Fetch all records for the entity. |
| POST | `/api/admin/<entity>` | Create a record. Accepts `multipart/form-data` for image uploads. |
| PUT | `/api/admin/<entity>/:id` | Update a record. Accepts `multipart/form-data`. |
| DELETE | `/api/admin/<entity>/:id` | Delete a record. |
