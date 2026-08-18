# Madrasah Management System - Frontend SPA

Modern, responsive single-page web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## 📌 Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **State & Data Fetching**: TanStack React Query + Axios
- **Form Validation**: React Hook Form + Zod
- **i18n**: Custom English / Bengali (`en` / `bn`) Language Provider

---

## ⚙️ Environment Variables Configuration (`.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Access the application at `http://localhost:5173`.

### 3. Build & Preview for Production
```bash
npm run build
npm run preview
```

---

## 🎨 UI/UX Features & Architecture

### 1. Bilingual Support (English / Bengali)
Integrated `LanguageContext` providing instant, zero-reload translation across public website pages, navigation headers, dashboards, and modal dialogs.

### 2. Public Madrasah Website
- **Home**: Hero banner, Madrasah statistics, feature highlights, and call-to-action buttons.
- **About Us**: History, mission, and core Islamic educational values.
- **Teachers Directory**: Public listing of faculty members and designations.
- **Classes Overview**: Academic curriculum and enrolled student counts.
- **Notices Board**: Official public notices and announcements.
- **Contact Page**: Office address, phone numbers, and contact form.
- **Portal Login**: Multi-role login portal with 1-click seed credential auto-fill.

### 3. Principal Administrative Dashboard
- **KPI Metrics**: Real-time cards for Total Students, Total Teachers, Attendance Rate %, SMS Sent, and SMS Failed.
- **Recharts Analytics**: Interactive Pie charts for Present/Absent breakdown and Bar charts for Class-wise attendance comparison.
- **Teacher Management**: Account creation, activation/deactivation toggles, and Class Teacher section assignments.
- **Class & Section Management**: Create classes, add sections, and assign Class Teachers.
- **Subject Management**: Master subjects directory and Subject Teacher assignment matrix.
- **Student Directory & Profiles**: Comprehensive student profile view with enrollment history, primary/secondary guardians, attendance summary, and Principal attendance override modal.
- **SMS Logs & Settings**: Delivery status filter, Bengali template editor, test SMS sender, and manual retry trigger button.
- **Audit Trail**: Filterable audit log tracking administrative overrides.

### 4. Teacher Portal
- **Dashboard**: Overview of classes where designated as Class Teacher or Subject Teacher.
- **Rapid Attendance Entry Sheet**: Mobile-optimized student roster table with quick "Mark All Present", "Mark All Absent", and individual status toggles.
- **Summary Confirmation Modal**: Displays Total Students, Present Count, and Absent Count before submitting attendance.
