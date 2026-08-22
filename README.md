# 🚀 Dayflow — Human Resource Management System

Dayflow is a full-stack **Human Resource Management System (HRMS)** built with the **MERN stack**. It provides a centralized platform for managing essential HR operations including employee authentication, profile management, attendance tracking, leave management, payroll visibility, and administrative analytics.

The system uses **role-based access control** to provide separate experiences for **Employees** and **Admins**. Employees can manage their own profile, attendance, leave requests, and payroll information, while Admins can manage employee records, review attendance and leave activity, update payroll information, and view workforce analytics.

---

## ✨ Features

### 🔐 Authentication & Authorization

* Employee/Admin signup
* Email verification
* Secure login
* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization middleware
* Protected API routes and pages

### 👤 Profile Management

* Employee profile viewing
* Profile editing
* Role-restricted profile access
* Secure access to personal employee information

### ⏱️ Attendance Management

* Employee check-in
* Employee check-out
* Attendance history
* Employee attendance view
* Admin attendance view
* Attendance-based analytics

### 🌴 Leave Management

* Employees can apply for leave
* Admins can review leave requests
* Approve/reject leave requests
* Leave status tracking
* Email notifications when leave status changes

### 💰 Payroll Management

* Employee read-only payroll view
* Admin payroll editing
* Salary information management
* Salary slip generation
* PDF salary slip download

### 📊 Admin Dashboard & Analytics

* Employee list
* Employee management
* Attendance analytics
* Leave analytics
* Workforce overview
* Charts and visual reports using Recharts

---

## 🛠️ Tech Stack

| Category               | Technology            |
| ---------------------- | --------------------- |
| Frontend               | React                 |
| Build Tool             | Vite                  |
| Styling                | Tailwind CSS          |
| Backend                | Node.js               |
| API Framework          | Express.js            |
| Database               | MongoDB               |
| Authentication         | JWT                   |
| Password Security      | bcrypt                |
| Email Service          | Nodemailer            |
| Analytics Charts       | Recharts              |
| Salary Slip Generation | PDFKit                |
| Architecture           | MERN Stack + REST API |

---

## 🏗️ Application Architecture

```text
┌──────────────────────┐
│      React + Vite    │
│      Frontend        │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│    Express + Node.js │
│       Backend        │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐  ┌──────────────┐
│ MongoDB  │  │ Email / PDF  │
│ Database │  │ Services     │
└──────────┘  └──────────────┘
```

---

## 📁 Project Structure

```text
HRMS-Portal/
│
├── backend/
│   ├── config/          # Database and application configuration
│   ├── controllers/     # Business logic for API requests
│   ├── middleware/      # Authentication, authorization and request middleware
│   ├── models/          # MongoDB/Mongoose data models
│   ├── routes/          # REST API route definitions
│   ├── .env.example     # Backend environment variable template
│   ├── package.json     # Backend dependencies and scripts
│   └── server.js        # Backend application entry point
│
├── frontend/
│   ├── src/
│   │   ├── auth/        # Login, signup and authentication functionality
│   │   ├── employee/    # Employee dashboard and employee features
│   │   ├── admin/       # Admin dashboard, management and analytics
│   │   └── shared/      # Shared components, utilities and common UI
│   │
│   ├── public/          # Static frontend assets
│   ├── .env.example     # Frontend environment variable template
│   ├── package.json     # Frontend dependencies and scripts
│   └── vite.config.js   # Vite configuration
│
├── .gitignore           # Files and folders excluded from Git
├── package.json         # Root project configuration
└── README.md            # Project documentation
```

> The exact file names inside `backend/` and `frontend/src/` may vary as the project evolves. The structure above describes the major responsibility of each application layer.

---

## 🔑 Role-Based Access

Dayflow provides two primary roles:

### 👨‍💼 Admin

Admins can:

* View and manage employees
* View attendance records
* Review and process leave requests
* Approve or reject leave applications
* Edit payroll information
* Generate salary slips
* View attendance analytics
* View leave analytics

### 👨‍💻 Employee

Employees can:

* Create an account
* Verify their email
* Login securely
* View and edit their permitted profile information
* Check in and check out
* View attendance history
* Apply for leave
* Track leave status
* Receive leave-status email notifications
* View payroll information
* Download salary slips

---

# ⚙️ Setup & Installation

## Prerequisites

Before running Dayflow locally, make sure the following are installed:

* **Node.js** — recommended Node.js 18+
* **npm**
* **MongoDB** — local MongoDB installation or MongoDB Atlas
* A working SMTP/email account for email verification and leave notifications

Check your Node.js and npm versions:

```bash
node --version
npm --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Suman-collab/HRMS-Portal.git
cd HRMS-Portal
```

---

## 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
```

Copy the environment template:

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Open `backend/.env` and provide the required configuration values.

Then start the backend:

```bash
npm run dev
```

The backend should now be running on the port configured by the project.

---

## 3. Frontend Setup

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

---

## ⚠️ Important: Run Both Applications

For local development, the frontend and backend must run **concurrently in two terminals**.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

The React frontend communicates with the Express backend through the configured API endpoints.

---

# 🔐 Environment Variables

The following variables should be configured according to the project's `.env.example` file.

> **Never commit real passwords, JWT secrets, SMTP credentials, API keys, or other sensitive values to GitHub.**

## Backend Environment Variables

| Variable         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `MONGO_URI`      | MongoDB connection string                                     |
| `JWT_SECRET`     | Secret key used to sign and verify JWT tokens                 |
| `JWT_EXPIRES_IN` | JWT token expiration duration                                 |
| `SMTP_HOST`      | SMTP server hostname used for sending emails                  |
| `SMTP_PORT`      | SMTP server port                                              |
| `SMTP_USER`      | SMTP account username/email                                   |
| `SMTP_PASS`      | SMTP account password or application-specific SMTP credential |

Example structure:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=<token-expiration-duration>

SMTP_HOST=<your-smtp-host>
SMTP_PORT=<your-smtp-port>
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-password>
```

## Frontend Environment Variables

If the frontend `.env.example` contains an API/base URL variable, configure it with the local backend address required by the frontend.

For example:

```env
VITE_API_URL=<your-backend-api-url>
```

Use the **exact variable name present in `frontend/.env.example`** if it differs from the example above.

---

# 🔒 Security

Dayflow uses several mechanisms to protect application data and API access:

* JWT-based authentication
* bcrypt password hashing
* Role-based authorization
* Protected API routes
* Email verification
* Environment-based secret management
* Server-side authorization checks
* Restricted employee/admin operations

Sensitive configuration values should always remain in environment variables and should not be committed to the repository.

---

# 📊 Main Application Workflow

```text
                    ┌───────────────┐
                    │     Signup    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │Email Verify   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │     Login     │
                    └───────┬───────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
             ┌────────────┐   ┌────────────┐
             │  Employee  │   │    Admin   │
             └─────┬──────┘   └─────┬──────┘
                   │                │
        ┌──────────┼─────────┐      │
        ▼          ▼         ▼      ▼
     Profile   Attendance  Leave  Management
                              │      │
                              ▼      ▼
                           Approval Analytics
                              │
                              ▼
                           Payroll
                              │
                              ▼
                       PDF Salary Slip
```

---

# 🗺️ Roadmap / Not Yet Implemented

The core HRMS workflow is implemented, but the following areas can be considered future enhancements if they remain outside the current project scope:

* [ ] Advanced HR reporting and downloadable reports
* [ ] Holiday/calendar management
* [ ] Real-time notifications
* [ ] Multi-organization/company support
* [ ] Advanced payroll processing and automation
* [ ] Production deployment and cloud infrastructure
* [ ] Automated testing and expanded test coverage
* [ ] Progressive Web App (PWA) support
* [ ] Additional HR modules such as recruitment and performance management

These items are **not required for the current core Dayflow implementation** and should be treated as future scope rather than completed functionality.

---

# 🎯 Project Goals

Dayflow is designed to simplify common HR operations by bringing employee and administrative workflows into one centralized system:

```text
Authentication
      ↓
Employee Profile
      ↓
Attendance
      ↓
Leave Management
      ↓
Payroll
      ↓
Analytics & Reporting
```

The goal is to reduce manual HR operations, improve transparency, provide secure role-based access, and give employees convenient access to their HR information.

---

# 🤝 Contributing

Contributions, bug reports, feature suggestions, and improvements are welcome.

If you would like to contribute:

```bash
git clone https://github.com/Suman-collab/HRMS-Portal.git
cd HRMS-Portal
```

Create a feature branch, make your changes, test them locally, and submit a pull request.

---

# 📄 License

This project is developed for educational and practical purposes.

---

## 📌 Dayflow at a Glance

| Area                      | Status          |
| ------------------------- | --------------- |
| MERN architecture         | ✅ Implemented   |
| Employee/Admin roles      | ✅ Implemented   |
| Signup & login            | ✅ Implemented   |
| Email verification        | ✅ Implemented   |
| JWT authentication        | ✅ Implemented   |
| bcrypt password hashing   | ✅ Implemented   |
| Profile management        | ✅ Implemented   |
| Attendance                | ✅ Implemented   |
| Leave management          | ✅ Implemented   |
| Leave email notifications | ✅ Implemented   |
| Employee payroll view     | ✅ Implemented   |
| Admin payroll editing     | ✅ Implemented   |
| PDF salary slips          | ✅ Implemented   |
| Admin employee list       | ✅ Implemented   |
| Attendance analytics      | ✅ Implemented   |
| Leave analytics           | ✅ Implemented   |
| Advanced HR modules       | 🚧 Future scope |
| Production deployment     | 🚧 Future scope |
