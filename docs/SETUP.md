# Development Setup

Follow these instructions to run the ENIGMA platform locally.

## Prerequisites
- **Node.js**: v18+ recommended (due to Vite).
- **MongoDB**: A local instance of MongoDB running on port `27017` or a MongoDB Atlas URI.
- **Git**: For version control.

## 1. Clone the Repository
```bash
git clone <repository-url>
cd egnisma
```

## 2. Backend Setup
The backend requires environment variables to function correctly.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration by copying the example template:
   ```bash
   cp .env.example .env
   ```
4. Populate `.env` with actual development values. You must generate a `bcrypt` hash for your admin password. Example:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/enigma
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=$2a$12$R9h... (generate this using a bcrypt tool)
   JWT_SECRET=my_local_dev_secret_key
   ```
5. Start the backend:
   ```bash
   npm start
   # Or for hot-reloading:
   node --watch server.js
   ```

## 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 4. Admin Initialization
There is no "first-time setup" database script required. Once your backend `.env` is configured, you can immediately access the CMS:
1. Navigate to `http://localhost:5173/admin/login`
2. Log in using the `ADMIN_USERNAME` and the plaintext password that corresponds to your `ADMIN_PASSWORD_HASH`.

From here, you can use the CMS to dynamically upload Mentors, Members, Projects, and create your first Events.
