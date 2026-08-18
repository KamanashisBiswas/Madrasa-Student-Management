import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Globe,
  Bell,
  UserCheck,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'TEACHER';

  // Dynamic Translated Navigation Items per Role
  const navItems = {
    PRINCIPAL: [
      { path: '/principal/dashboard', label: t('principalDashboard'), icon: LayoutDashboard },
      { path: '/principal/teachers', label: t('teacherManagement'), icon: Users },
      { path: '/principal/classes', label: t('classManagement'), icon: GraduationCap },
      { path: '/principal/subjects', label: t('subjectManagement'), icon: BookOpen },
      { path: '/principal/students', label: t('studentDirectory'), icon: UserCheck },
      { path: '/principal/attendance', label: t('classAttendance'), icon: CalendarCheck },
      { path: '/principal/sms-logs', label: t('smsLogs'), icon: MessageSquare },
      { path: '/principal/sms-settings', label: t('smsSettings'), icon: Settings },
      { path: '/principal/audit-logs', label: t('auditTrail'), icon: ShieldCheck },
    ],
    TEACHER: [
      { path: '/teacher/dashboard', label: t('teacherDashboard'), icon: LayoutDashboard },
      { path: '/teacher/take-attendance', label: t('takeAttendance'), icon: CalendarCheck },
      { path: '/teacher/students', label: t('assignedStudents'), icon: Users },
    ],
  }[role] || [];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-950 text-white border-r border-emerald-900 shadow-lg">
        {/* Brand */}
        <div className="p-4 border-b border-emerald-900 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-amber-300 flex items-center justify-center font-bold shadow border border-emerald-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight text-emerald-100">{t('appName')}</h2>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-400 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-800">
              {role === 'PRINCIPAL' ? (language === 'bn' ? 'অধ্যক্ষ' : 'PRINCIPAL') : (language === 'bn' ? 'শিক্ষক' : 'TEACHER')}
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  active
                    ? 'bg-emerald-700 text-white shadow'
                    : 'text-emerald-200 hover:bg-emerald-900/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-emerald-900 bg-emerald-950/80">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-semibold text-xs border border-emerald-600">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-emerald-100 truncate">{user?.email}</p>
              <p className="text-[10px] text-emerald-400 font-mono capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs py-2 rounded-md transition font-medium border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h3 className="text-sm font-semibold text-slate-800 hidden sm:block">
              {t('systemTitle')}
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-md transition border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold text-emerald-800">{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notifications badge */}
            <div className="relative p-1.5 text-slate-500 hover:text-emerald-700 cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-emerald-950 text-white p-4 space-y-2 border-b border-emerald-900">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm hover:bg-emerald-800"
              >
                <item.icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Body */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
