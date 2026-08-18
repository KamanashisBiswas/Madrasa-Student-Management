import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { TeachersPublic } from './pages/public/TeachersPublic';
import { ClassesPublic } from './pages/public/ClassesPublic';
import { NoticesPublic } from './pages/public/NoticesPublic';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';

// Principal Pages
import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';
import { TeacherManagement } from './pages/principal/TeacherManagement';
import { ClassManagement } from './pages/principal/ClassManagement';
import { SubjectManagement } from './pages/principal/SubjectManagement';
import { StudentManagement } from './pages/principal/StudentManagement';
import { StudentProfile } from './pages/principal/StudentProfile';
import { SMSLogsPage } from './pages/principal/SMSLogsPage';
import { SMSSettingsPage } from './pages/principal/SMSSettingsPage';
import { AuditLogsPage } from './pages/principal/AuditLogsPage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TakeAttendancePage } from './pages/teacher/TakeAttendancePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center text-slate-400 py-12">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'PRINCIPAL') return <Navigate to="/principal/dashboard" replace />;
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="teachers" element={<TeachersPublic />} />
              <Route path="classes" element={<ClassesPublic />} />
              <Route path="notices" element={<NoticesPublic />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Principal Portal */}
            <Route
              path="/principal"
              element={
                <ProtectedRoute allowedRoles={['PRINCIPAL']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<PrincipalDashboard />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="subjects" element={<SubjectManagement />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="students/:id" element={<StudentProfile />} />
              <Route path="attendance" element={<TakeAttendancePage />} />
              <Route path="sms-logs" element={<SMSLogsPage />} />
              <Route path="sms-settings" element={<SMSSettingsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* Teacher Portal */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="take-attendance" element={<TakeAttendancePage />} />
              <Route path="students" element={<StudentManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
