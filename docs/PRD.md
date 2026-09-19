# Product Requirements Document (PRD)

## Product Name
ENIGMA CMS & Technical Club Platform

## Problem Statement
The AIMT Department of Computer Science and Engineering lacks a centralized, dynamic platform to showcase student achievements, technical projects, and manage club events. Previous event registrations were handled manually, leading to disorganized attendance tracking and verification.

## Product Objective
Provide a unified, highly aesthetic web platform showcasing club members, projects, and achievements, coupled with a robust, automated Event Management System that handles dynamic registrations, QR ticketing, and attendance verification.

## Target Users
- **Students / Participants**: Users browsing the club's portfolio and registering for events.
- **Club Administrators**: Core team members managing the website's content and scanning event tickets.

## User Roles
1. **Public User**: Can view events, members, projects, achievements, and register for open events.
2. **Admin**: Can authenticate into the CMS, perform CRUD operations on all content, export registration CSVs, and use the built-in QR Scanner to verify attendance.

## Core Features (Implemented)
- Dynamic display of Mentors, Members, Projects, and Achievements.
- Categorized Event Management (Upcoming vs Previous).
- Dynamic Event Registration Forms with deadline and capacity constraints.
- Automated QR Code Generation for digital event passes.
- Admin QR Scanner for on-site attendance verification.
- Real-time Attendance Dashboard for events.
- CSV Export of registered participants (scrubbed of internal secure tokens).
- JWT-based protected CMS interface.

## Event Registration Workflow
1. **Event Creation**: Admin creates an event in the CMS, setting a registration deadline and uploading promotional banners.
2. **User Registration**: Student views the event details and fills out the registration form. The system prevents duplicate registrations via email/roll number checks.
3. **QR Issuance**: Upon successful registration, the backend generates a unique secure token, mapping it to a QR code presented to the user as a Digital Pass.

## Admin & Attendance Workflow
1. **CMS Access**: Admin logs in via `/admin/login` using hashed `.env` credentials.
2. **Event Dashboard**: Admin selects an event and can view live registration metrics.
3. **Verification**: At the event venue, the Admin opens the "QR Scanner" tab on their mobile device.
4. **Scanning**: Scanning a participant's QR code hits a protected backend API, verifying the token and immediately marking the participant as "Attended", updating the live dashboard metrics.

## Functional Requirements
- System MUST serve all dynamic images directly from the backend via `multer` uploads.
- System MUST reject event registrations past the specified deadline.
- CMS MUST protect all modification routes with an HttpOnly JWT cookie.

## Non-Functional Requirements
- **Aesthetics**: The frontend must adhere strictly to a Neo-Brutalist design (harsh borders, primary colors, sharp shadows).
- **Responsiveness**: The CMS must be fully functional on mobile devices, specifically the QR scanner.
- **Performance**: The frontend uses Vite for rapid compilation and optimized chunking.

## Security Requirements
- Admin passwords MUST NOT be stored in plain text anywhere in the repository.
- Registration tokens embedded in QR codes MUST be randomized UUIDs/crypto-tokens, not sequential database IDs.
- CSV exports MUST NOT include these secure tokens.

## Current Scope vs Future Ideas
**Currently Implemented:**
- Full CMS for Members, Mentors, Projects, Achievements, Events.
- Complete Event Registration & QR Attendance flow.
- Image uploading and serving.

**Out of Scope (Future Features):**
- Automated email notifications.
- Certificate generation.
- Multi-admin roles/permissions.
- Payment gateways.
