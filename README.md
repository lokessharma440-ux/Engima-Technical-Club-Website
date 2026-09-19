# ENIGMA Technical Club

## Overview
The official technical club website for the AIMT Department of Computer Science and Engineering. Built with a stunning Neo-Brutalist design language, the ENIGMA CMS manages everything from dynamic event registrations to member showcases, providing a fully integrated student experience.

## Features
- **Official Club Information**: Dynamic showcases of Members, Mentors, Faculty Coordinators, Projects, and Achievements.
- **Dynamic Event Management**: Supports categorized upcoming and previous events with robust details.
- **Event Registration**: Dynamic registration forms for events, featuring automatic deadline enforcement and capacity tracking.
- **Digital Event Pass & QR**: Upon registration, attendees receive a digital pass with a unique QR code.
- **Admin QR Scanner**: Built-in web-based QR scanner for admins to seamlessly verify and mark attendance at the venue.
- **Attendance Verification & Dashboard**: Real-time attendance tracking and dashboard metrics.
- **CSV Export**: Securely export registered participants to CSV directly from the admin dashboard.
- **CMS / Admin Management**: Full CRUD capabilities for every aspect of the website, protected by JWT authentication.

## Tech Stack
**Frontend:**
- React (Vite)
- React Router DOM
- Tailwind CSS v4 (Neo-Brutalist Custom Theme)
- Framer Motion (Micro-animations)
- Lucide React (Icons)
- @yudiel/react-qr-scanner (QR Code Scanning)
- qrcode.react (QR Code Generation)
- Axios

**Backend:**
- Node.js
- Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & HTTP-Only Cookies
- bcryptjs (Password Hashing)
- multer (File Uploads & Image Serving)

## Project Structure
```text
ENIGMA/
├── backend/                  # Express.js REST API & Admin CMS endpoints
│   ├── models/               # Mongoose schemas (Event, TeamMember, Registration, etc.)
│   ├── routes/               # API endpoints (api.js, admin.js)
│   ├── uploads/              # Local file storage for CMS uploaded assets
│   └── server.js             # Main backend application entry point
├── frontend/                 # React frontend application
│   ├── src/                  
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Application pages & Admin views
│   │   └── utils/            # Helper functions
│   └── index.html            # Main HTML entry
└── docs/                     # Project Documentation
```

## Installation
Clone the repository:
```bash
git clone <your-repo-url>
cd egnisma
```

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/` using the `.env.example` template:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/enigma
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<your_bcrypt_hash>
JWT_SECRET=supersecretjwtkey
```
Start the backend server:
```bash
npm start
# or for development:
node --watch server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## Environment Variables
The application strictly relies on the following backend environment variables:
- `PORT`: The port the backend will run on (Default: `5000`)
- `MONGODB_URI`: The MongoDB connection string
- `ADMIN_USERNAME`: The username required to log into the Admin CMS
- `ADMIN_PASSWORD_HASH`: A Bcrypt hash of the administrator's password
- `JWT_SECRET`: A secure random string used to sign JWT tokens

## Running Locally
Ensure MongoDB is running locally.
1. Run backend: `cd backend && node server.js`
2. Run frontend: `cd frontend && npm run dev`
3. Access the main app at `http://localhost:5173`
4. Access the CMS at `http://localhost:5173/admin/login`

## Admin System
The CMS is heavily protected. The admin must log in using the credentials defined in the `.env` file. Upon successful login, the backend issues an `HttpOnly` JWT cookie, preventing XSS attacks from stealing the session. The admin panel provides total control over events, members, projects, achievements, and gallery assets.

## Event Registration Flow
1. **Event**: Admin creates an event and opens registration.
2. **Registration Form**: Student fills out their details.
3. **Registration ID**: A unique secure token is generated for the participant.
4. **QR Code**: The participant is shown a Digital Pass containing a QR code representing their token.
5. **Admin Scanner**: At the venue, an admin logs into the CMS on their phone and opens the QR Scanner.
6. **Attendance Verification**: The scanner reads the QR code, verifies the secure token against the database, and marks the student as "Attended".

## CSV Export
Admins can download a CSV of all registered participants for any given event directly from the dashboard. For security, sensitive internal QR tokens and MongoDB ObjectIDs are deliberately excluded from the generated CSV.

## Security Notes
- **HttpOnly Cookies**: Admin sessions are stored in HttpOnly, secure cookies.
- **Password Hashing**: The admin password is never stored in plain text; the `.env` strictly requires a `bcrypt` hash.
- **Protected Routes**: All `/api/admin/*` routes require a valid JWT signature.
- **QR Token Handling**: QR codes embed randomized secure registration tokens rather than sequential IDs to prevent spoofing.
- **Server-Side Validation**: All file uploads (`multer`) enforce size limits to prevent DoS attacks.

## Testing
When modifying the application, ensure to test the following flows:
- End-to-end registration on an open event.
- Verifying the system rejects duplicate registrations (by email/roll number).
- Generation of the QR code modal.
- Scanning the QR code via the Admin QR Scanner (using a mobile device or webcam).
- Ensuring CSV exports function correctly without exposing internal tokens.
- Uploading and deleting assets inside the CMS to verify no dangling files remain.

## Deployment
Before deploying to production:
1. Generate a strong `JWT_SECRET`.
2. Generate a bcrypt hash for your desired admin password.
3. Provide a production `MONGODB_URI` (e.g., MongoDB Atlas).
4. Run `npm run build` in the frontend and host the `dist/` directory on a static provider (Vercel, Netlify).
5. Host the backend on a Node.js provider (Render, Railway, Heroku), ensuring `uploads/` is backed by persistent storage if necessary.
