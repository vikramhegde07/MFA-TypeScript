# 🔐 MFA Example App

A full-stack demo of secure Multi-Factor Authentication (MFA) built using:

- 🧩 Express.js (Node.js)
- 🗃️ MongoDB + Mongoose
- ⚛️ React + Vite + TypeScript
- 🔐 TOTP-based MFA (Google Authenticator)
- 📄 JWT-based session management

---

## 🚀 Features

- ✅ User registration & login
- 🔐 MFA setup with QR code (TOTP, Google Authenticator-compatible)
- ✍️ Verify MFA during login
- ⚙️ Enable/disable MFA from profile page
- 📦 Secure JWT-based auth system
- 🌙 Fully responsive with light/dark themes
- ⚠️ Demo accounts auto-delete after 24 hours *(for public testing)*

---

## 🛠 Tech Stack

| Frontend       | Backend              | Auth & DB              |
| -------------- | -------------------- | ---------------------- |
| React + Vite   | Express + Node.js    | JWT + MongoDB + Mongoose |
| TypeScript     | REST API             | bcrypt + TOTP          |
| Tailwind CSS   | CORS, Helmet, etc.   | qrcode + speakeasy     |

---

## 📁 Folder Structure

mfa-app/
├── mfa/ # Vite + React frontend

│ ├── pages/ # Login, Register, Profile, Home

│ └── context/ # AuthContext for global state

│ └── components/ # Components code to handle various operations

├── backend/ # Express backend

│ ├── routes/ # /auth, /user, /mfa

│ ├── models/ # User model

│ └── middlewares/ # JWT auth, error handling


---

## 🔄 API Endpoints Overview

| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| POST   | /user/register         | Create new user                     |
| POST   | /user/login            | Login with email + password         |
| POST   | /user/verify-mfa       | Verify MFA during login             |
| POST   | /user/verify-password  | Verify password for auth            |
| GET    | /user/setup-mfa        | Start MFA setup (QR code)           |
| POST   | /user/verify-mfa-setup | Finalize MFA setup                  |
| POST   | /user/disable-mfa      | Disable MFA                         |
| GET    | /user/refresh-user     | Get latest user info                |

---

## 🧪 Usage & Testing

1. Clone the repo:
   ```bash
   git clone https://github.com/vikramhegde07/MFA-TypeScript.git
   cd MFA-TypeScript
   ```

2. Start the backend:
  ```bash
  cd server
  npm install
  npm run dev
  ```

3. Start the frontend:
  ```bash
  cd client
  npm install
  npm run dev
  ```

  Open the app at: http://localhost:5173

4. 🧹 Auto-Cleanup Logic

    Temporary demo users and tasks are automatically deleted after 24 hours.

    Useful for public showcases and preventing backend abuse.

5. 👨‍💻 Author

Vikram Hegde
Portfolio – NodeNomad.in
GitHub • LinkedIn
🌐 Live Demo

Will be hosted at mfa.nodenomad.in
