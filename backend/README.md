# Madrasah Management System - Backend API

Production-ready Express.js & TypeScript RESTful API for the **Madrasah Management & Student Attendance Management System**.

## 📌 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT Access Token (15m) + Refresh Token (7d)
- **Password Hashing**: bcryptjs
- **Validation**: Zod (Schema-based request validation)
- **Security**: Helmet, CORS, Express Rate Limit
- **Dev Database Safety**: MongoDB Memory Server (`mongodb-memory-server`) fallback for development/testing when `MONGODB_URI` is unspecified.

---

## ⚙️ Environment Variables Configuration (`.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/madrasah
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=madrasah_access_secret_super_secure_key_12345
JWT_REFRESH_SECRET=madrasah_refresh_secret_super_secure_key_67890
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

SMS_PROVIDER=MOCK
SMS_API_URL=https://api.smsbd.net/sendsms
SMS_API_KEY=mock_api_key_sample
SMS_SENDER_ID=MadrasahEdu
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Initial Database Data
Populates default Academic Year (2026-2027), Principal account, Teachers (Abdullah Sir, Rahman Sir, Karim Sir), Classes (6, 7, 8), Subjects, Students, Guardians, and System Settings.

```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build TypeScript for Production
```bash
npm run build
npm start
```

---

## 🔑 Demo Login Credentials (V1)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Principal** | `principal@madrasah.edu` | `principal123` |
| **Teacher** | `abdullah@madrasah.edu` | `teacher123` |

---

## 🛡️ API Endpoints Directory (`/api/v1`)

### Authentication (`/auth`)
- `POST /auth/login` - Login with email & password (returns Access + Refresh JWT)
- `POST /auth/refresh` - Generate new Access Token via Refresh Token
- `POST /auth/logout` - Revoke active refresh session
- `POST /auth/change-password` - Update account password
- `GET /auth/me` - Fetch authenticated user profile

### Academic Years (`/academic-years`)
- `GET /academic-years` - List all academic years
- `GET /academic-years/active` - Fetch current active academic year
- `POST /academic-years` - Create academic year (Principal)
- `PATCH /academic-years/:id/set-active` - Set active academic year (Principal)

### Classes & Sections (`/classes`)
- `GET /classes` - List classes with sections & student counts
- `POST /classes` - Create new class (Principal)
- `POST /classes/sections` - Create section under class (Principal)
- `PUT /classes/sections/:sectionId/class-teacher` - Assign/Change Class Teacher (Principal)

### Subjects & Assignments (`/subjects`)
- `GET /subjects` - List master subjects
- `POST /subjects` - Create subject (Principal)
- `GET /subjects/assignments` - Fetch subject assignments matrix
- `POST /subjects/assignments` - Assign Subject Teacher to Class + Section (Principal)

### Teachers (`/teachers`)
- `GET /teachers` - List all teachers with assignments
- `GET /teachers/my-classes` - Fetch logged-in teacher's assigned classes & subjects
- `POST /teachers` - Create teacher account & profile (Principal)
- `PATCH /teachers/:id/status` - Activate / Deactivate teacher account (Principal)

### Students & Guardians (`/students`)
- `GET /students` - Filterable student directory (Name, ID, Roll, Class)
- `POST /students` - Register student with primary/secondary guardians & academic enrollment (Principal)
- `GET /students/:id` - Full student profile (Guardians, Enrollment History, Attendance Summary, Log)

### Attendance & Overrides (`/attendance`)
- `GET /attendance/roster` - Fetch class section student roster for attendance entry
- `POST /attendance/submit` - Submit batch class attendance (Validates teacher permissions, prevents duplicates, checks edit window, queues async SMS)
- `PUT /attendance/override` - Principal attendance override with mandatory modification reason & audit log

### SMS & Settings (`/sms`)
- `GET /sms/logs` - Filterable guardian SMS delivery history (Principal)
- `GET /sms/settings` - Fetch SMS toggles, templates, and edit window minutes (Principal)
- `PUT /sms/settings` - Update SMS settings (Principal)
- `POST /sms/test` - Dispatch test SMS (Principal)
- `POST /sms/retry-failed` - Manually trigger retry worker for failed SMS queue items (Principal)

### Audit & Reports (`/reports`, `/audit`)
- `GET /reports/dashboard` - Principal KPI stats (Present/Absent %, Class stats, SMS delivery)
- `GET /audit` - Immutable audit log trail (Principal)

---

## 📱 SMS Engine & Abstraction

The SMS engine uses a polymorphic `ISMSProvider` interface:
- **`MockSMSProvider`**: Logs formatted Bengali messages to console & database (`SMS_PROVIDER=MOCK`).
- **`HttpSMSProvider`**: Interacts with real Bangladesh SMS HTTP Gateway (`SMS_PROVIDER=HTTP`).

Attendance submission saves instantly and returns HTTP 200 to the teacher, while enqueuing `PENDING` SMS logs that are processed asynchronously by `SMSService`.
