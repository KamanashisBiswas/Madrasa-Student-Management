# Madrasah Management & Student Attendance System

A production-ready, full-stack **Madrasah Management & Student Attendance Management System** featuring a modern React/TypeScript frontend and a secure Express/TypeScript REST API backed by MongoDB.

---

## 📐 System Architecture Overview

```
Suman/
├── backend/                  # Express.js + TypeScript RESTful API
│   ├── src/
│   │   ├── config/           # Database & Env configurations
│   │   ├── controllers/      # Auth, Class, Subject, Teacher, Student, Attendance, SMS, Audit
│   │   ├── middleware/       # JWT Auth, RBAC Authorization, Error Handler
│   │   ├── models/           # Mongoose Schemas (17 collections)
│   │   ├── routes/           # Express API endpoints
│   │   ├── services/         # Business logic & SMSService (Mock & HTTP)
│   │   ├── seed/             # Seed data generator
│   │   └── server.ts         # Server entrypoint
│   ├── .env.example
│   └── package.json
└── frontend/                 # React + TypeScript + Vite Single Page App
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # AuthContext & LanguageContext (English/Bengali)
    │   ├── layouts/          # PublicLayout & DashboardLayout
    │   ├── pages/            # Public Website, Principal Portal, Teacher Portal
    │   ├── services/         # Axios API client & endpoints
    │   └── App.tsx           # React Router setup
    ├── .env.example
    └── package.json
```

---

## 📊 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    AcademicYear ||--o{ Class : "contains"
    AcademicYear ||--o{ StudentEnrollment : "enrolls in"
    AcademicYear ||--o{ SubjectAssignment : "schedules"
    AcademicYear ||--o{ ClassAttendance : "records"
    
    User ||--o| Teacher : "authenticates"

    Teacher ||--o{ Section : "Class Teacher of"
    Teacher ||--o{ SubjectAssignment : "teaches"
    
    Class ||--o{ Section : "has"
    Class ||--o{ SubjectAssignment : "offers"
    Class ||--o{ StudentEnrollment : "has students"
    
    Subject ||--o{ SubjectAssignment : "assigned to"
    
    Student ||--o{ StudentEnrollment : "enrollment history"
    Student ||--o{ StudentGuardian : "has guardians"
    Guardian ||--o{ StudentGuardian : "represents"
    
    StudentEnrollment ||--o{ ClassAttendance : "tracks"
    Student ||--o{ SMSLog : "receives SMS for"
    User ||--o{ AuditLog : "triggers"
```

---

## 🎯 Version 1 Scope & Features

### 1. Authentication Roles (V1)
- **`PRINCIPAL`**: Highest administrative authority. Full access to teachers, classes, subjects, student profiles, attendance overrides, SMS logs/settings, audit trail, and analytics.
- **`TEACHER`**: Faculty portal. Access to assigned classes (as Class Teacher or Subject Teacher), rapid attendance entry sheet, and student rosters.
- *(Note: Student and Guardian profiles are fully maintained and managed in the system, while login access is reserved for Principal and Teachers in Version 1).*

### 2. Core Modules
- **Separated Class Teacher & Subject Teacher Assignments**: Dedicated modeling for Class Teachers (overall section responsibility) and Subject Teachers (subject-specific instruction per class/section).
- **First-Class Academic Year & Enrollment History**: Multi-year academic tracking via `AcademicYear` and `StudentEnrollment`, preserving historical records across class promotions.
- **Multi-Guardian Mapping**: `Guardian` and `StudentGuardian` entities linking primary & emergency contacts. Primary guardians receive automated Bengali SMS notifications upon student absence.
- **Decoupled Asynchronous SMS Engine**: Non-blocking `SMSService` worker enqueues `PENDING` SMS logs and dispatches notifications in the background with retry management (`attemptCount`, `maxAttempts`) and polymorphic provider abstraction (`MockSMSProvider` / `HttpSMSProvider`).
- **Principal Attendance Overrides & Audit Trail**: Configurable edit window (30 min default) for teachers; unrestricted override for Principal with mandatory `modificationReason` logged into `AuditLog`.
- **Modern Public Website**: Public pages for Home, About, Teachers Directory, Classes, Notices, Contact, and Portal Login with i18n English/Bengali support.

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- Local MongoDB running on `mongodb://localhost:27017` (or MongoDB Atlas Cloud URL)

### 1. Clone & Setup Backend
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Populate seed data (Principal, Teachers, Classes, Subjects, Students, Guardians)
npm run seed

# Start backend dev server (Port 5000)
npm run dev
```

### 2. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env

# Start frontend dev server (Port 5173)
npm run dev
```

---

## 🔑 Demo Login Credentials

| Role | Email / ID | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Principal** | `principal@madrasah.edu` | `principal123` | Full Administrative Dashboard, Teacher Management, Class/Section CRUD, Subject CRUD, Student Directory & Profiles, Attendance Overrides, SMS Logs & Settings, Audit Trail |
| **Teacher** | `abdullah@madrasah.edu` | `teacher123` | Teacher Dashboard, Assigned Classes (Class 6A), Rapid Attendance Entry Sheet with batch controls & confirmation modal |

---

## 🛡️ Security & Performance

- **JWT Tokens**: Short-lived Access Tokens (15m) + Long-lived Refresh Tokens (7d) stored securely.
- **Password Security**: Hashed via `bcryptjs` with salt rounds = 10.
- **Database Safety**: Production mode strictly fails if `MONGODB_URI` is missing; development mode allows `mongodb-memory-server` fallback.
- **Security Middlewares**: `helmet` header protection, `cors` domain restriction, `express-rate-limit` request throttling.
- **Validation**: Strict Zod schema validation on both server-side API requests and client-side forms.
