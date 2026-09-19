# Testing Checklist

When deploying changes or adding features, ensure the following core flows remain functional.

## 1. CMS & Authentication
- [ ] Attempt to access `/admin/dashboard` while logged out (should redirect to login).
- [ ] Log in with invalid credentials (should show error).
- [ ] Log in with valid credentials (should redirect to dashboard and set HttpOnly cookie).
- [ ] Upload a new image (e.g., adding a Team Member). Verify the image renders correctly on the frontend via `http://localhost:5000/uploads/...`.
- [ ] Delete the Team Member. Verify the UI updates immediately.

## 2. Event Creation & Configuration
- [ ] Create a new Event with both an "Outer Card Poster" and an "Inner Wide Banner".
- [ ] Verify both images appear correctly on the frontend (Card on `/events`, Banner on `/events/slug`).
- [ ] Set `registrationDeadline` to a date in the past. Verify the frontend displays "Registrations Closed".
- [ ] Set `registrationDeadline` to a future date. Verify the frontend displays the Registration form.

## 3. Event Registration Flow
- [ ] Fill out the event registration form with valid data.
- [ ] Verify a Digital Pass (with QR Code) is immediately displayed upon success.
- [ ] Attempt to register again using the exact same Email or Roll Number. Verify the system rejects the duplicate registration gracefully.

## 4. QR Scanning & Attendance Verification
- [ ] Open the CMS on a secondary device (e.g., your smartphone) and navigate to the "QR Scanner" tab.
- [ ] Point the camera at the QR code generated in Step 3.
- [ ] Verify the scanner reads the code, queries the backend, and displays a green "Verified" success state with the participant's name.
- [ ] Check the "Attendance" tab in the CMS. Verify the event's "Attended" count has incremented by 1.

## 5. CSV Export
- [ ] Navigate to the Registrations table for the event in the CMS.
- [ ] Click "Export to CSV".
- [ ] Open the generated CSV file. Ensure all user-submitted data (Name, Email, Phone, Roll Number, Branch) is present.
- [ ] **SECURITY CHECK**: Ensure the `qrToken`, `_id`, and `__v` fields are strictly absent from the CSV output.

## 6. Frontend Build Verification
- [ ] Run `npm run build` in the `frontend/` directory.
- [ ] Ensure Vite outputs no chunking or missing dependency errors.
- [ ] Serve the `dist/` folder using `npx serve -s dist` and verify the app runs smoothly without the development server.
