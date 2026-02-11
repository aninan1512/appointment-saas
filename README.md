# Multi-Tenant Appointment SaaS  
### Production-Style MERN Application

A production-style **multi-tenant appointment scheduling SaaS** built with the MERN stack.  
This project demonstrates secure authentication, tenant-scoped data, and a modern React dashboard designed to reflect real-world SaaS architecture.

---

## 🚀 Project Overview

This project demonstrates:

- Real-world SaaS architecture
- Secure authentication patterns
- Multi-tenant data isolation
- RESTful API design
- Full-stack MERN development
- Production-ready folder structure

---

## 🏷️ Tech Stack

### Frontend
- React (Vite)
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Zod validation
- bcrypt
- JWT Authentication

---

## ✨ Features

- Multi-tenant onboarding (Tenant + Owner created on registration)
- Email & password authentication
- Access Token + Refresh Token system
- Tenant-scoped services and appointments
- Appointment conflict detection
- Appointment status workflow:
  - BOOKED
  - CANCELLED
  - COMPLETED
- Protected routes
- Responsive UI

---

## 🧠 Architecture Overview

Client → Express API → Authentication Middleware → Controllers → MongoDB

Flow:
1. User registers → Tenant created
2. User logs in → JWT issued
3. Protected routes validate tenantId
4. All queries filtered by tenantId
5. Refresh token maintains session securely

---

## 📁 Project Structure

```
appointment-saas/
│
├── backend/
├── frontend/
├── screenshots/
├── README.md
└── .gitignore
```

---

## 🔌 Core API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|--------|--------|
| POST | /api/auth/register | Create tenant + owner |
| POST | /api/auth/login | Returns access token |
| POST | /api/auth/refresh | Returns new token |
| POST | /api/auth/logout | Clears session |

---

### User

| Method | Endpoint |
|--------|--------|
| GET | /api/users/me |

---

### Services

| Method | Endpoint |
|--------|--------|
| GET | /api/services |
| POST | /api/services |

---

### Appointments

| Method | Endpoint |
|--------|--------|
| GET | /api/appointments |
| POST | /api/appointments |
| PATCH | /api/appointments/:id/status |

Example request:

```json
{ "status": "CANCELLED" }
```

---

## 🔒 Security Practices

- Password hashing using bcrypt
- JWT authentication
- Refresh tokens stored in httpOnly cookies
- Tenant-level data isolation
- Environment variables for secrets
- Input validation using Zod

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone <YOUR_REPO_URL>
cd appointment-saas
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run backend:

```bash
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

---

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 📸 Screenshots

Make sure your folder structure is:

```
appointment-saas/screenshots/
```

Images should be named:

```
login.png
dashboard.png
services.png
appointments.png
```

### Login
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Services
![Services](screenshots/services.png)

### Appointments
![Appointments](screenshots/appointments.png)

---

## 🗺️ Roadmap

- Staff accounts and roles
- Calendar integration
- Email notifications
- Pagination and search
- Stripe payments
- Deployment to AWS or Render

---

## 📦 Deployment (Recommended)

Backend:
- Render
- Railway
- AWS EC2

Frontend:
- Vercel
- Netlify

Database:
- MongoDB Atlas

---

## 🎯 Why This Project Matters

This project demonstrates real-world skills:

- Backend architecture
- Secure authentication
- SaaS multi-tenancy
- REST API design
- React dashboard design
- Clean folder structure
- Professional documentation

---

## 👨‍💻 Author

Aaron Ninan  
GitHub: https://github.com/aninan1512  
LinkedIn: https://www.linkedin.com/in/aaron-ninan-798938287  

---

## ⭐ If you found this project useful

Consider giving it a star on GitHub.

